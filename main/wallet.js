'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { default: Filecoin, HDWalletProvider } = require('@glif/filecoin-wallet-provider')
const { CoinType } = require('@glif/filecoin-address')
const electronLog = require('electron-log')
const assert = require('assert')
const { request, gql } = require('graphql-request')
const { FilecoinNumber } = require('@glif/filecoin-number')

/** @typedef {import('./typings').GQLMessage} GQLMessage */

const log = electronLog.scope('wallet')

let address = ''
/** @type {Filecoin | null} */
let provider = null

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

async function setup () {
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

async function listTransactions () {
  const url = 'https://graph.glif.link/query'
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
  await Promise.all(messages.map(async message => {
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
  }))
  const transactions = messages.map(message => ({
    hash: message.cid,
    timestamp: message.timestamp,
    status: 'sent',
    outgoing: message.from.robust === address,
    amount: new FilecoinNumber(message.value, 'attofil').toFil(),
    address: message.from.robust === address
      ? message.to.robust
      : message.from.robust
  }))
  return transactions
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
  listTransactions
}
