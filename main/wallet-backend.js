'use strict'

const keytar = require('keytar')
const { strict: assert } = require('node:assert')
const { ethers } = require('ethers')
const {
  delegatedFromEthAddress,
  ethAddressFromDelegated,
  CoinType
} = require('@glif/filecoin-address')
const fs = require('node:fs/promises')
const { join } = require('node:path')
const { decode } = require('@glif/filecoin-address')
const timers = require('node:timers/promises')
const log = require('electron-log').scope('wallet-backend')

/** @typedef {import('./typings').WalletSeed} WalletSeed */
/**
 * @typedef
 * {import('./typings').BeryxTransactionsResponse}
 * BeryxTransactionsResponse
 */
/** @typedef {import('./typings').BeryxTransaction} BeryxTransaction */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {
  import('./typings').FILTransactionProcessing
} FILTransactionProcessing */

const DISABLE_KEYTAR = process.env.DISABLE_KEYTAR === 'true'
// eslint-disable-next-line max-len
const BERYX_TOKEN = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleS1iZXJ5eC0wMDEiLCJ0eXAiOiJKV1QifQ.eyJyb2xlcyI6W10sImlzcyI6IlpvbmRheCIsImF1ZCI6WyJiZXJ5eCJdLCJleHAiOjE3MTE3OTM5MjAsImp0aSI6Ikp1bGlhbiBHcnViZXIsanVsaWFuQGp1bGlhbmdydWJlci5jb20ifQ.BGJQa_aM3EAV9pWMM_dgb2E7MiUdQflSHp4LJpMq7qOjfywpBudLUtbDSHaZmR2WtvrCv7wGJbEficVXFa5BAg'

// eslint-disable-next-line @typescript-eslint/no-empty-function
async function noop () {}

class WalletBackend {
  constructor ({
    disableKeytar = DISABLE_KEYTAR,
    onTransactionUpdate = noop
  } = {}) {
    /** @type {ethers.providers.JsonRpcProvider | null} */
    this.provider = null
    /** @type {ethers.Wallet | null} */
    this.signer = null
    /** @type {string | null} */
    this.address = null
    /** @type {string | null} */
    this.addressDelegated = null
    /** @type {(FILTransaction|FILTransactionProcessing)[]} */
    this.transactions = []
    this.disableKeytar = disableKeytar
    this.onTransactionUpdate = onTransactionUpdate
  }

  /**
   * @param {string} [testSeed]
   */
  async setup (testSeed) {
    let seed, isNew
    if (testSeed) {
      seed = testSeed
      isNew = false
    } else {
      ({ seed, isNew } = await this.getSeedPhrase())
    }
    this.provider = new ethers.providers.JsonRpcProvider({
      url: 'https://api.node.glif.io/rpc/v0',
      headers: {
        Authorization: 'Bearer VOeqfEFbUjr/vnvYSwbohKuilNkdmD/4tI3gXzV7f3g='
      }
    })
    this.signer = ethers.Wallet.fromMnemonic(seed).connect(this.provider)
    this.address = this.signer.address
    this.addressDelegated = delegatedFromEthAddress(this.address, CoinType.MAIN)
    this.filForwarder = new ethers.Contract(
      '0x2b3ef6906429b580b7b2080de5ca893bc282c225',
      await fs.readFile(join(__dirname, 'filforwarder-abi.json'), 'utf8'),
      this.provider
    ).connect(this.signer)
    this.meridian = new ethers.Contract(
      '0x811765AccE724cD5582984cb35f5dE02d587CA12',
      await fs.readFile(join(__dirname, 'meridian-abi.json'), 'utf8'),
      this.provider
    )

    return { seedIsNew: isNew }
  }

  /**
   * @returns {Promise<WalletSeed>}
   */
  async getSeedPhrase () {
    const service = 'filecoin-station-wallet-0x'
    let seed
    if (!this.disableKeytar) {
      seed = await keytar.getPassword(service, 'seed')
      if (seed) {
        return { seed, isNew: false }
      }
    }

    seed = ethers.Wallet.createRandom().mnemonic.phrase
    if (!this.disableKeytar) {
      await keytar.setPassword(service, 'seed', seed)
    }
    return { seed, isNew: true }
  }

  async fetchBalance () {
    assert(this.signer)
    return await this.signer.getBalance()
  }

  /**
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @returns {Promise<string>}
   */
  async transferFunds (to, amount) {
    log.info('transferFunds()', { to, amount: amount.toString() })

    if (to.startsWith('0x')) {
      return this.transferFundsToEthAddress(to, amount)
    } else if (to.startsWith('f4')) {
      return this.transferFundsToEthAddress(ethAddressFromDelegated(to), amount)
    } else if (to.startsWith('f1')) {
      return this.transferFundsToF1Address(to, amount)
    } else {
      throw new Error('Unknown address type')
    }
  }

  /**
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @returns {Promise<string>}
   */
  async transferFundsToF1Address (to, amount) {
    return await this.runTransaction(to, amount, async () => {
      assert(this.signer)
      assert(this.filForwarder)

      const amountMinusGas = amount.sub(ethers.utils.parseEther('0.1'))
      log.info('filForwarder.forward()', {
        to,
        amountMinusGas: amountMinusGas.toString()
      })
      return await this.filForwarder.forward(
        decode(to).bytes,
        { value: amountMinusGas }
      )
    })
  }

  /**
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @returns {Promise<string>}
   */
  async transferFundsToEthAddress (to, amount) {
    return await this.runTransaction(to, amount, async () => {
      assert(this.signer)

      const amountMinusGas = amount.sub(ethers.utils.parseEther('0.01'))
      log.info('sendTransaction()', {
        to,
        amount: amount.toString(),
        amountMinusGas: amountMinusGas.toString()
      })
      return await this.signer.sendTransaction({
        to,
        value: amountMinusGas
      })
    })
  }

  /**
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @param {function} fn
   * @returns {Promise<string>}
   */
  async runTransaction (to, amount, fn) {
    assert(this.signer)

    /** @type {FILTransactionProcessing} */
    const transaction = {
      timestamp: new Date().getTime(),
      status: 'processing',
      outgoing: true,
      amount: ethers.utils.formatUnits(amount, 18),
      address: to.startsWith('f1')
        ? to
        : delegatedFromEthAddress(to, CoinType.MAIN)
    }
    this.transactions.push(transaction)
    this.onTransactionUpdate()

    try {
      const tx = await fn()
      log.info({ hash: tx.hash })
      assert(tx.hash, 'Transaction hash not found')
      const cid = await this.convertEthTxHashToCid(tx.hash)
      log.info({ cid })
      transaction.hash = cid
      this.onTransactionUpdate()
      return cid
    } catch (err) {
      log.error(err)
      transaction.status = 'failed'
      this.onTransactionUpdate()
      throw err
    }
  }

  /**
   * @param {string} hash
   * @returns {Promise<string>}
   */
  async convertEthTxHashToCid (hash) {
    log.info('convertEthTxHashToCid', { hash })
    for (let attempt = 0; attempt < 20; attempt++) {
      const res = await fetch(
        `https://api.zondax.ch/fil/data/v3/mainnet/transactions/hash/${hash}`,
        {
          headers: {
            authorization: `Bearer ${BERYX_TOKEN}`
          }
        }
      )
      const body = /** @type {BeryxTransactionsResponse} */ (await res.json())
      const tx = body.transactions.find(tx => tx.tx_type !== 'Fee')
      if (tx) {
        return tx.tx_cid
      }
      await timers.setTimeout(10_000)
    }
    throw new Error('Could not convert ETH tx hash to CID')
  }

  /**
   * @param {string} address
   * @returns Promise<BeryxTransaction[]>
   */
  async getMessages (address) {
    const types = ['sender', 'receiver']
    const messages = await Promise.all(types.map(async type => {
      const res = await fetch(
        `https://api.zondax.ch/fil/data/v3/mainnet/transactions/address/${address}/${type}`,
        {
          headers: {
            authorization: `Bearer ${BERYX_TOKEN}`
          }
        }
      )
      assert(res.ok, `Could not fetch messages (Status ${res.status})`)
      const { transactions } =
        /** @type {BeryxTransactionsResponse} */ (await res.json())
      return transactions
    }))
    return messages
      .flat()
      .filter(tx => tx.tx_type !== 'Fee')
      .sort((a, b) => {
        return new Date(b.tx_timestamp).getTime() -
          new Date(a.tx_timestamp).getTime()
      })
  }

  /**
   * @returns {Promise<void>}
   */
  async fetchAllTransactions () {
    assert(this.address)

    // Load messages
    const messages = await this.getMessages(this.address)

    /** @type {(FILTransaction|FILTransactionProcessing)[]} */
    const transactions = messages.map(message => {
      assert(this.addressDelegated)
      return {
        height: message.height,
        hash: message.tx_cid,
        outgoing: message.tx_from === this.addressDelegated,
        amount: ethers.utils.formatUnits(BigInt(message.amount), 18),
        address: message.tx_from === this.addressDelegated
          ? message.tx_to
          : message.tx_from,
        timestamp: new Date(message.tx_timestamp).getTime(),
        status: message.status === 'Ok'
          ? 'succeeded'
          : 'failed'
      }
    })

    // Add locally known transactions not yet returned by the API
    for (const transaction of this.transactions) {
      if (
        !transaction.hash ||
        !transactions.find(tx => tx.hash === transaction.hash)
      ) {
        transactions.push(transaction)
      }
    }

    // Update state
    this.transactions = transactions
    this.onTransactionUpdate()
  }

  /**
   * @returns {Promise<ethers.BigNumber>}
   */
  async fetchScheduledRewards () {
    assert(this.address, 'address')
    assert(this.meridian, 'meridian client')
    try {
      return await this.meridian.rewardsScheduledFor(this.address)
    } catch (/** @type {any} */ err) {
      log.error('Cannot fetch scheduled rewards:', err)
      return ethers.BigNumber.from(0)
    }
  }
}

module.exports = {
  WalletBackend
}
