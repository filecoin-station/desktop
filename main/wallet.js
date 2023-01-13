'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { default: Filecoin, HDWalletProvider } = require('@glif/filecoin-wallet-provider')
const { CoinType } = require('@glif/filecoin-address')
const electronLog = require('electron-log')
const assert = require('assert')
const { request, gql } = require('graphql-request')
const { FilecoinNumber } = require('@glif/filecoin-number')
const { Message } = require('@glif/filecoin-message')
const { getDestinationWalletAddress } = require('./station-config')
const timers = require('timers/promises')

/** @typedef {import('./typings').GQLMessage} GQLMessage */
/** @typedef {import('./typings').GQLStateReplay} GQLStateReplay */
/** @typedef {import('bignumber.js').BigNumber} BigNumber */
/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {import('./typings').TransactionStatus} TransactionStatus */

const log = electronLog.scope('wallet')
const url = 'https://graph.glif.link/query'

let address = ''
/** @type {Filecoin | null} */
let provider = null
/** @type {Context | null} */
let ctx = null
/** @type {FILTransaction[]} */
let transactions = []
/** @type {FILTransaction | null} */
let processingTransaction = null

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
}

/**
 * @returns {Promise<string>}
 */
async function getBalance () {
  assert(provider)
  const balance = await provider.getBalance(address)
  return balance.toFil()
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

async function listTransactions () {
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

  await Promise.all([
    ...messages.map(async message => {
      const query = gql`
        query Tipset($height: Uint64!) {
          tipset(height: $height) {
            minTimestamp
          }
        }
      `
      const variables = {
        height: message.height
      }
      const { tipset } = await request(url, query, variables)
      message.timestamp = tipset.minTimestamp * 1000
    }),
    ...messages.map(async message => {
      try {
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
        const variables = {
          cid: message.cid
        }
        /** @type {{stateReplay: GQLStateReplay}} */
        const { stateReplay } = await request(url, query, variables)
        message.exitCode = stateReplay.receipt.exitCode
      } catch (err) {
        console.error(`Failed getting status for ${message.cid}`)
      }
    })
  ])

  transactions = messages
    .map(message => {
      assert(message.timestamp)
      /** @type {TransactionStatus} */
      const status = message.exitCode === 0 ? 'sent' : 'failed'
      return {
        hash: message.cid,
        timestamp: message.timestamp,
        status,
        outgoing: message.from.robust === address,
        amount: new FilecoinNumber(message.value, 'attofil').toFil(),
        address: message.from.robust === address
          ? message.to.robust
          : message.from.robust
      }
    })
    .filter(transaction => transaction.status === 'sent')

  console.log({ transactions })
  return transactions
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
    params: ''
  })
  const messageWithGas = await provider.gasEstimateMessageGas(
    message.toLotusType()
  )
  console.log({ messageWithGas, gasLimit: messageWithGas.gasLimit, ret: new FilecoinNumber(messageWithGas.gasLimit, 'attofil').toFil() })
  return new FilecoinNumber(messageWithGas.gasLimit, 'attofil')
}

function sendTransactionsToUI () {
  assert(ctx)
  const transactionUpdate = []
  if (processingTransaction) {
    transactionUpdate.push(processingTransaction)
  }
  transactionUpdate.push(...transactions)
  ctx.transactionUpdate(transactionUpdate)
}

/**
 * @param {string} from
 * @param {string} to
 * @param {FilecoinNumber} amount
 * @returns {Promise<void>}
 */
async function transferFunds (from, to, amount) {
  assert(ctx)

  processingTransaction = {
    hash: '',
    timestamp: Date.now(),
    status: 'processing',
    outgoing: true,
    amount: amount.toString(),
    address: to
  }
  sendTransactionsToUI()

  try {
    console.log({ transferAmount: amount.toString() })
    assert(provider)
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

    while (true) {
      try {
        const stateReplay = await getStateReplay(cid)
        processingTransaction.status = stateReplay.receipt.exitCode === 0
          ? 'sent'
          : 'failed'
        break
      } catch {
        await timers.setTimeout(1000)
      }
    }
  } catch (err) {
    processingTransaction.status = 'failed'
  }

  sendTransactionsToUI()
  await timers.setTimeout(6000)
  processingTransaction = null
  sendTransactionsToUI()
}

/*
 * @returns {Promise<void>}
 */
async function transferAllFundsToDestinationWallet () {
  assert(provider)
  const to = getDestinationWalletAddress()
  assert(to)
  const balance = await provider.getBalance(address)
  await transferFunds(address, to, balance)
}

/**
 * @returns {string}
 */
function getAddress () {
  return address
}

module.exports = {
  setup,
  getAddress,
  getBalance,
  listTransactions,
  transferAllFundsToDestinationWallet
}
