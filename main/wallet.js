'use strict'

const electronLog = require('electron-log')
const assert = require('assert')
const { getDestinationWalletAddress } = require('./station-config')
const timers = require('node:timers/promises')
const Store = require('electron-store')
const { WalletBackend } = require('./wallet-backend')
const { ethers } = require('ethers')

/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {
  import('./typings').FILTransactionProcessing
} FILTransactionProcessing */

const log = electronLog.scope('wallet')
const walletStore = new Store({
  name: 'wallet'
})

const backend = new WalletBackend({
  async onTransactionUpdate () {
    walletStore.set('transactions_0x', backend.transactions)
    sendTransactionsToUI()
  }
})
backend.transactions = loadStoredEntries()

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
  return ethers.utils.formatUnits(balance, 18)
}

// Inline `p-debounce.promise` from
// https://github.com/sindresorhus/p-debounce/blob/1ba9d31dd81eee55b93ef67e38b8fa24781df63b/index.js#L38-L53
// since v5 is ESM only.
// This reduces the concurrency of `updateBalance` to 1, to prevent race
// conditions.

/** @type {Promise<void>|undefined} */
let updateBalancePromise
async function updateBalance () {
  if (updateBalancePromise) {
    return updateBalancePromise
  }
  try {
    updateBalancePromise = _updateBalance()
    return await updateBalancePromise
  } finally {
    updateBalancePromise = undefined
  }
}

async function _updateBalance () {
  assert(ctx)
  balance = await backend.fetchBalance()
  walletStore.set('balance_0x', balance.toHexString())
  ctx.balanceUpdate(ethers.utils.formatUnits(balance, 18))
}

function listTransactions () {
  return getTransactionsForUI(backend.transactions)
}

/**
 * @param {(FILTransaction|FILTransactionProcessing)[]} transactions
 * @returns {(FILTransaction|FILTransactionProcessing)[]}
 */
function getTransactionsForUI (transactions) {
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
  ctx.transactionUpdate(listTransactions())
}

/**
 * @param {string} from
 * @param {string} to
 * @returns {Promise<void>}
 */
async function transferAllFunds (from, to) {
  assert(ctx)

  try {
    const cid = await backend.transferAllFunds(from, to)
    console.log({ cid })
  } catch (err) {
    log.error('Transferring funds', err)
  }
}

/*
 * @returns {Promise<void>}
 */
async function transferAllFundsToDestinationWallet () {
  assert(backend.address)
  const to = getDestinationWalletAddress()
  assert(to)
  try {
    await transferAllFunds(backend.address, to)
  } finally {
    await updateBalance()
  }
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
  return /** @type {any} */ (walletStore.get('transactions_0x', []))
}

/**
 * @returns {ethers.BigNumber}
 */
function loadBalance () {
  return ethers.BigNumber.from(
    // A workaround to fix false TypeScript errors
    /** @type {string} */ (walletStore.get('balance_0x', '0x0'))
  )
}

module.exports = {
  setup,
  getAddress,
  getBalance,
  listTransactions,
  transferAllFundsToDestinationWallet,
  getTransactionsForUI
}
