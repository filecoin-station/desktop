'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { default: Filecoin, HDWalletProvider } = require('@glif/filecoin-wallet-provider')
const { CoinType } = require('@glif/filecoin-address')
const electronLog = require('electron-log')

const log = electronLog.scope('wallet')

let address = '' /** @type {string} */

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
  const provider = new Filecoin(new HDWalletProvider(seed), {
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
 * @returns {string}
 */
function getAddress () {
  return address
}

module.exports = {
  setup,
  getAddress
}
