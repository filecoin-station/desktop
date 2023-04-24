'use strict'

const { WalletBackend } = require('../wallet-backend')
const assert = require('assert').strict
const { FilecoinNumber } = require('@glif/filecoin-number')

describe('Wallet Backend', function () {
  const backend = new WalletBackend({ disableKeytar: true })

  describe('setup()', function () {
    it('sets up provider and address', async function () {
      await backend.setup()
      assert(backend.provider)
      assert(backend.address)
    })
  })

  describe('getSeedPhrase()', function () {
    it('gets a seed phrase', async function () {
      const { seed } = await backend.getSeedPhrase()
      assert(seed)
    })
  })

  describe('fetchBalance()', function () {
    it('fetches the balance', /** @this {Mocha.Test} */ async function () {
      this.timeout(60_000)
      const balance = await backend.fetchBalance()
      assert(balance)
    })
  })

  describe('getGasLimit()', function () {
    it('gets the gas limit', /** @this {Mocha.Test} */ async function () {
      this.timeout(60_000)

      const gasLimit = await backend.getGasLimit(
        'f17uoq6tp427uzv7fztkbsnn64iwotfrristwpryy',
        'f17uoq6tp427uzv7fztkbsnn64iwotfrristwpryy',
        new FilecoinNumber('0', 'fil')
      )
      assert(gasLimit)
    })
  })

  describe('fetchAllTransactions()', function () {
    it('fetches all transactions', /** @this {Mocha.Test} */ async function () {
      this.timeout(20_000)

      await backend.fetchAllTransactions()
      assert(backend.transactions)
    })
  })
})
