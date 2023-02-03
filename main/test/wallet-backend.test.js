'use strict'

const { WalletBackend } = require('../wallet-backend')
const assert = require('assert').strict
const { FilecoinNumber } = require('@glif/filecoin-number')

describe('Wallet Backend', function () {
  describe('getSeedPhrase()', function () {
    it('gets a seed phrase', async function () {
      const backend = new WalletBackend()
      const { seed } = await backend.getSeedPhrase({ disableKeytar: true })
      assert(seed)
    })
  })

  /** @type {WalletBackend | null} */
  let backend

  describe('setup()', function () {
    it('sets up provider and address', async function () {
      backend = new WalletBackend()
      await backend.setup({ disableKeytar: true })
      assert(backend.provider)
      assert(backend.address)
    })
  })

  describe('fetchBalance()', function () {
    it('fetches the balance', async function () {
      assert(backend)
      const balance = await backend.fetchBalance()
      assert(balance)
    })
  })

  describe('getGasLimit()', function () {
    it('gets the gas limit', /** @this {Mocha.Test} */ async function () {
      this.timeout(30_000)

      assert(backend)
      const gasLimit = await backend.getGasLimit(
        'f17uoq6tp427uzv7fztkbsnn64iwotfrristwpryy',
        'f17uoq6tp427uzv7fztkbsnn64iwotfrristwpryy',
        new FilecoinNumber('0', 'fil')
      )
      assert(gasLimit)
    })
  })
})
