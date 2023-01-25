'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { default: Filecoin, HDWalletProvider } = require('@glif/filecoin-wallet-provider')
const { CoinType } = require('@glif/filecoin-address')
const electronLog = require('electron-log')
const assert = require('assert')
const { request, gql } = require('graphql-request')
const { FilecoinNumber, BigNumber } = require('@glif/filecoin-number')
const { Message } = require('@glif/filecoin-message')
const { getDestinationWalletAddress } = require('./station-config')
const timers = require('node:timers/promises')
const Store = require('electron-store')

/** @typedef {import('./typings').GQLMessage} GQLMessage */
/** @typedef {import('./typings').GQLStateReplay} GQLStateReplay */
/** @typedef {import('./typings').GQLTipset} GQLTipset */
/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {import('./typings').FILTransactionProcessing} FILTransactionProcessing */
/** @typedef {import('./typings').FILTransactionLoading} FILTransactionLoading */
/** @typedef {import('./typings').TransactionStatus} TransactionStatus */

const log = electronLog.scope('wallet')
const url = 'https://graph.glif.link/query'
const walletStore = new Store({
  name: 'wallet'
})

let address = ''
/** @type {Filecoin | null} */
let provider = null
/** @type {Context | null} */
let ctx = null
let transactions = loadStoredEntries()
let balance = loadBalance()
/** @type {Set<string>} */
const stateReplaysBeingFetched = new Set()

/**
 * @returns {Promise<string>}
 */
async function getSeedPhrase () {
  const service = 'filecoin-station-wallet'
  let seed = await keytar.getPassword(service, 'seed')
  if (seed) {
    log.info('Using existing seed phrase')
  } else {
    seed = generateMnemonic()
    await keytar.setPassword(service, 'seed', seed)
    log.info('Created new seed phrase')
  }
  return seed
}

/**
 * @param {Context} _ctx
 */
async function setup (_ctx) {
  ctx = _ctx

  const seed = await getSeedPhrase()
  provider = new Filecoin(new HDWalletProvider(seed), {
    apiAddress: 'https://api.node.glif.io/rpc/v0'
  })
  ;[address] = await provider.wallet.getAccounts(
    0,
    1,
    CoinType.MAIN
  )
  log.info('Address: %s', address)

  ;(async () => {
    while (true) {
      try {
        updateBalance()
      } catch (err) {
        log.error('Updating balance', err)
      }
      try {
        updateTransactions()
      } catch (err) {
        log.error('Updating transactions', err)
      }
      await timers.setTimeout(10_000)
    }
  })()
}

/**
 * @returns {string}
 */
function getBalance () {
  return balance.toFil()
}

async function updateBalance () {
  assert(provider)
  assert(ctx)
  balance = (await provider.getBalance(address))
  walletStore.set('balance', balance.toFil())
  ctx.balanceUpdate(balance.toFil())
}

/**
 * @param {string} cid
 * @returns {Promise<GQLStateReplay>}
 */
async function getStateReplay (cid) {
  const query = gql`
    query StateReplay($cid: String!) {
      stateReplay(cid: $cid) {
        receipt {
          return
          exitCode
          gasUsed
        }
        executionTrace {
          executionTrace
        }
      }
    }
  `
  const variables = { cid }
  /** @type {{stateReplay: GQLStateReplay}} */
  const { stateReplay } = await request(url, query, variables)
  return stateReplay
}

/**
 * @param {number} height
 * @returns Promise<GQLTipset>
 */
async function getTipset (height) {
  const query = gql`
    query Tipset($height: Uint64!) {
      tipset(height: $height) {
        minTimestamp
      }
    }
  `
  const variables = { height }
  const { tipset } = await request(url, query, variables)
  return tipset
}

/**
 * @param {string} address
 * @returns Promise<GQLMessage[]>
 */
async function getMessages (address) {
  const query = gql`
    query Messages($address: String!, $limit: Int!, $offset: Int!) {
      messages(address: $address, limit: $limit, offset: $offset) {
        cid
        to {
          robust
        }
        from {
          robust
        }
        nonce
        height
        method
        params
        value
      }
    }
  `
  const variables = {
    address,
    limit: 100,
    offset: 0
  }
  /** @type {{messages: GQLMessage[]}} */
  const { messages = [] } = await request(url, query, variables)
  return messages
}

/**
 * @returns {Promise<void>}
 */
async function updateTransactions () {
  console.log(new Date(), 'updateTransactions')

  // Load messages
  const messages = await getMessages(address)

  // Convert messages to transactions (loading)
  /** @type {FILTransactionLoading[]} */
  const transactionsLoading = messages.map(message => {
    return {
      height: message.height,
      hash: message.cid,
      outgoing: message.from.robust === address,
      amount: new FilecoinNumber(message.value, 'attofil').toFil(),
      address: message.from.robust === address
        ? message.to.robust
        : message.from.robust
    }
  })

  /** @type {(FILTransaction|FILTransactionProcessing)[]} */
  const updatedTransactions = []

  for (const transactionProcessing of transactionsLoading) {
    // Find matching transaction
    const tx = transactions.find(tx => tx.hash === transactionProcessing.hash)

    // Complete already loaded data
    // Keep references alive by prefering `tx`
    const transaction = tx || transactionProcessing

    if (!transaction.timestamp && transaction.height) {
      transaction.timestamp =
        (await getTipset(transaction.height)).minTimestamp * 1000
    }

    if (
      transaction.hash &&
      (!transaction.status || transaction.status === 'processing') &&
      !stateReplaysBeingFetched.has(transaction.hash)
    ) {
      const { hash } = transaction
      stateReplaysBeingFetched.add(hash)
      transaction.status = 'processing'
      ;(async () => {
        while (true) {
          try {
            const stateReplay = await getStateReplay(hash)
            transaction.status = stateReplay.receipt.exitCode === 0
              ? 'sent'
              : 'failed'
            stateReplaysBeingFetched.delete(hash)
            walletStore.set('transactions', updatedTransactions)
            if (transaction.status === 'sent') {
              try {
                await updateBalance()
              } catch {}
            }
            sendTransactionsToUI()
            break
          } catch (err) {
            console.error(
              `Failed getting status for ${transactionProcessing.hash}`
            )
            await timers.setTimeout(12_000)
          }
        }
      })()
    }

    updatedTransactions.push(
      /** @type {FILTransaction} */
      (transaction)
    )
  }

  // Add transaction potentially not yet returned by the API
  for (const transaction of transactions) {
    if (!updatedTransactions.find(tx => tx.hash === transaction.hash)) {
      updatedTransactions.push(transaction)
      break
    }
  }

  // Update state
  transactions = updatedTransactions

  // Save transactions
  walletStore.set('transactions', updatedTransactions)

  // Send transaction state to UI
  sendTransactionsToUI()
}

function listTransactions () {
  return getTransactionsForUI()
}

/**
 * @param {string} from
 * @param {string} to
 * @param {FilecoinNumber} amount
 * @returns Promise<FilecoinNumber>
 */
async function getGasLimit (from, to, amount) {
  assert(provider)
  const message = new Message({
    to,
    from,
    nonce: 0,
    value: amount.toAttoFil(),
    method: 0,
    params: '',
    gasPremium: 0,
    gasFeeCap: 0,
    gasLimit: 0
  })
  const messageWithGas = await provider.gasEstimateMessageGas(
    message.toLotusType()
  )
  const feeCapStr = messageWithGas.gasFeeCap.toFixed(0, BigNumber.ROUND_CEIL)
  const feeCap = new FilecoinNumber(feeCapStr, 'attofil')
  const gas = feeCap.times(messageWithGas.gasLimit)
  console.log({ messageWithGas, gasLimit: messageWithGas.gasLimit, gas })
  return gas
}

function getTransactionsForUI () {
  let processing
  const sent = []

  for (const transaction of transactions) {
    if (
      !processing &&
      transaction.status === 'processing' &&
      transaction.outgoing
    ) {
      processing = transaction
    } else if (transaction.status === 'sent') {
      sent.push(transaction)
    }
  }
  const update = [
    ...(processing ? [processing] : []),
    ...sent
  ]

  return update
}

function sendTransactionsToUI () {
  assert(ctx)
  ctx.transactionUpdate(getTransactionsForUI())
}

/**
 * @param {string} from
 * @param {string} to
 * @param {FilecoinNumber} amount
 * @returns {Promise<void>}
 */
async function transferFunds (from, to, amount) {
  assert(ctx)
  assert(provider)

  /** @type {FILTransactionProcessing} */
  const transaction = {
    timestamp: new Date().getTime(),
    status: 'processing',
    outgoing: true,
    amount: amount.toString(),
    address: to
  }
  transactions.push(transaction)
  sendTransactionsToUI()

  try {
    console.log({ transferAmount: amount.toString() })
    const gasLimit = await getGasLimit(from, to, amount)
    const message = new Message({
      to,
      from,
      nonce: await provider.getNonce(from),
      value: amount.minus(gasLimit).toAttoFil(),
      method: 0,
      params: ''
    })
    console.log({ messageAfterGasSubtracted: message, value: message.value.toString() })
    const messageWithGas = await provider.gasEstimateMessageGas(
      message.toLotusType()
    )
    const lotusMessage = messageWithGas.toLotusType()
    const msgValid = await provider.simulateMessage(lotusMessage)
    assert(msgValid, 'Message is invalid')
    const signedMessage = await provider.wallet.sign(from, lotusMessage)
    const { '/': cid } = await provider.sendMessage(signedMessage)
    console.log({ CID: cid })

    transaction.hash = cid
    sendTransactionsToUI()
  } catch (err) {
    transaction.status = 'failed'
    sendTransactionsToUI()
  }
}

/*
 * @returns {Promise<void>}
 */
async function transferAllFundsToDestinationWallet () {
  assert(provider)
  const to = getDestinationWalletAddress()
  assert(to)
  // FIXME: Only transfer a little FIL for now
  const balance = new FilecoinNumber('0.00001', 'fil')
  await transferFunds(address, to, balance)
  await updateBalance()
}

/**
 * @returns {string}
 */
function getAddress () {
  return address
}

/**
 * @returns {(FILTransaction|FILTransactionProcessing)[]}
 */
function loadStoredEntries () {
  // A workaround to fix false TypeScript errors
  return /** @type {any} */ (walletStore.get('transactions', []))
}

/**
 * @returns {FilecoinNumber}
 */
function loadBalance () {
  // A workaround to fix false TypeScript errors
  return new FilecoinNumber(
    /** @type {string} */ (walletStore.get('balance', '0')),
    'fil'
  )
}

module.exports = {
  setup,
  getAddress,
  getBalance,
  listTransactions,
  transferAllFundsToDestinationWallet
}
