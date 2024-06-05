'use strict'

const { WalletBackend } = require('../wallet-backend')
const assert = require('assert').strict
const { ethers } = require('ethers')

const { TEST_SEED_PHRASE } = process.env

const randomSeed = () => {
  const wallet = ethers.Wallet.createRandom()
  const seed = wallet.mnemonic.phrase
  console.log('Using randomly-generated wallet address', wallet.address)
  console.log('SEED:', seed)
  return seed
}

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
      //  We need a seed for a wallet that already has some transactions
      if (!TEST_SEED_PHRASE) return this.skip()
      this.timeout(120_000)

      await backend.setup(TEST_SEED_PHRASE)
      await pRetry(() => backend.fetchAllTransactions(), {
        retries: 10,
        onFailedAttempt: err => {
          console.error(err)
          console.error('Retrying...')
        }
      })
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
    it(
      'fetches rewards scheduled for disbursement',
      /** @this {Mocha.Test} */ async function () {
        this.timeout(60_000)
        // We need a new wallet that doesn't have any scheduled rewards
        await backend.setup(randomSeed())
        const amount = await pRetry(
          () => backend.fetchScheduledRewards(),
          { retries: 10 }
        )
        assert.strictEqual(amount.toBigInt(), 0n)
      }
    )
  })
})
