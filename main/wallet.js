'use strict'

const electronLog = require('electron-log')
const assert = require('assert')
const { FilecoinNumber } = require('@glif/filecoin-number')
const { getDestinationWalletAddress } = require('./station-config')
const timers = require('node:timers/promises')
const Store = require('electron-store')
const { WalletBackend } = require('./wallet-backend')

/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {import('./typings').FILTransactionProcessing} FILTransactionProcessing */

const log = electronLog.scope('wallet')
const walletStore = new Store({
  name: 'wallet'
})

const backend = new WalletBackend()
backend.transactions = loadStoredEntries()
backend.onTransactionUpdate = function () {
  walletStore.set('transactions', backend.transactions)
  sendTransactionsToUI()
}
backend.onTransactionSucceeded = async function () {
  await updateBalance()
}

/** @type {Context | null} */
let ctx = null
let balance = loadBalance()

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
    await backend.fetchAllTransactions()
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

function listTransactions () {
  return getTransactionsForUI()
}

function getTransactionsForUI () {
  let processing
  const sent = []

  for (const transaction of backend.transactions) {
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
  backend.transactions.push(transaction)
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
