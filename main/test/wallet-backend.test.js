'use strict'

const { WalletBackend } = require('../wallet-backend')
const assert = require('assert').strict

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

  describe('fetchAllTransactions()', function () {
    it('fetches all transactions', /** @this {Mocha.Test} */ async function () {
      this.timeout(20_000)

      await backend.setup(
        // eslint-disable-next-line max-len
        'insane believe defy best among myself mistake account paddle episode life music fame impact below define habit rotate clay innocent history depart slice series'
      )
      await backend.fetchAllTransactions()
      assert.notStrictEqual(backend.transactions.length, 0, 'has transactions')
      for (const tx of backend.transactions) {
        assert.notStrictEqual(
          new Date(tx.timestamp).getFullYear(),
          1970,
          'timestamp isn\'t too old'
        )
      }
    })
  })
})
