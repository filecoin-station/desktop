'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')

/** @typedef {import('./typings').WalletSeed} WalletSeed */

/**
 * @returns {Promise<WalletSeed>}
 */
async function getSeedPhrase () {
  const service = 'filecoin-station-wallet'
  let seed = await keytar.getPassword(service, 'seed')
  if (seed) {
    return { seed, isNew: false }
  }

  seed = generateMnemonic()
  await keytar.setPassword(service, 'seed', seed)
  return { seed, isNew: true }
}

module.exports = {
  getSeedPhrase
}
