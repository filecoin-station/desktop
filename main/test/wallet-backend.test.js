'use strict'

const { WalletBackend } = require('../wallet-backend')
const assert = require('assert').strict

describe('Wallet Backend', function () {
  const backend = new WalletBackend({ disableKeytar: true })
  /** @type {import('p-retry').default} */
  let pRetry

  before(async function () {
    pRetry = (await import('p-retry')).default
  })

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
        // Here we want a seed for a wallet that already has some transactions
        // eslint-disable-next-line max-len
        'insane believe defy best among myself mistake account paddle episode life music fame impact below define habit rotate clay innocent history depart slice series'
      )
      await pRetry(() => backend.fetchAllTransactions(), { retries: 10 })
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

  describe('fetchScheduledRewards()', function () {
    it('fetches rewards scheduled for disbursement', async function () {
      await backend.setup(
        // Here we want a random seed that doesn't have any scheduled rewards
        // eslint-disable-next-line max-len
        'expect trouble oyster fire leave frown strong mechanic cotton harsh black since bargain paddle stereo fresh neutral math iron coral trophy slab place marine'
      )
      const amount = await pRetry(
        () => backend.fetchScheduledRewards(),
        { retries: 10 }
      )
      assert.strictEqual(amount.toBigInt(), 0n)
    })
  })
})
