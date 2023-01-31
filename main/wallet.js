'use strict'

const electronLog = require('electron-log')
const assert = require('assert')
const { request, gql } = require('graphql-request')
const { FilecoinNumber } = require('@glif/filecoin-number')
const { getDestinationWalletAddress } = require('./station-config')
const timers = require('node:timers/promises')
const Store = require('electron-store')
const { WalletBackend } = require('./wallet-backend')

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

const backend = new WalletBackend()

/** @type {Context | null} */
let ctx = null
let transactions = loadStoredEntries()
let balance = loadBalance()
/** @type {Set<string>} */
const stateReplaysBeingFetched = new Set()

/**
 * @param {Context} _ctx
 */
async function setup (_ctx) {
  ctx = _ctx

  const { seedIsNew } = await backend.setup()
  if (seedIsNew) {
    log.info('Created new seed phrase')
  } else {
    log.info('Using existing seed phrase')
  }

  log.info('Address: %s', backend.address)

  ;(async () => {
    while (true) {
      await refreshState()
      await timers.setTimeout(10_000)
    }
  })()
}

async function refreshState () {
  try {
    await updateBalance()
  } catch (err) {
    log.error('Updating balance', err)
  }
  try {
    await updateTransactions()
  } catch (err) {
    log.error('Updating transactions', err)
  }
}

/**
 * @returns {string}
 */
function getBalance () {
  return balance.toFil()
}

async function updateBalance () {
  assert(ctx)
  balance = await backend.fetchBalance()
  walletStore.set('balance', balance.toFil())
  ctx.balanceUpdate(balance.toFil())
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
  assert(backend.address)

  console.log(new Date(), 'updateTransactions')

  // Load messages
  const messages = await getMessages(backend.address)

  // Convert messages to transactions (loading)
  /** @type {FILTransactionLoading[]} */
  const transactionsLoading = messages.map(message => {
    return {
      height: message.height,
      hash: message.cid,
      outgoing: message.from.robust === backend.address,
      amount: new FilecoinNumber(message.value, 'attofil').toFil(),
      address: message.from.robust === backend.address
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
            const stateReplay = await backend.getStateReplay(hash)
            transaction.status = stateReplay.receipt.exitCode === 0
              ? 'succeeded'
              : 'failed'
            stateReplaysBeingFetched.delete(hash)
            walletStore.set('transactions', updatedTransactions)
            if (transaction.status === 'succeeded') {
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
    } else if (transaction.status === 'succeeded') {
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
    const cid = await backend.transferFunds(from, to, amount)
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
  assert(backend.address)
  const to = getDestinationWalletAddress()
  assert(to)
  // FIXME: Only transfer a little FIL for now
  const balance = new FilecoinNumber('0.00001', 'fil')
  await transferFunds(backend.address, to, balance)
  await updateBalance()
}

/**
 * @returns {string}
 */
function getAddress () {
  return backend.address || ''
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
