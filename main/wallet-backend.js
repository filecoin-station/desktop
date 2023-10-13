'use strict'

const keytar = require('keytar')
// TODO: Replace with ethers tooling
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { strict: assert } = require('node:assert')
const { ethers } = require('ethers')
const { delegatedFromEthAddress, CoinType } = require('@glif/filecoin-address')

/** @typedef {import('./typings').WalletSeed} WalletSeed */
/** @typedef {import('./typings').FoxMessage} FoxMessage */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {
  import('./typings').FILTransactionProcessing
} FILTransactionProcessing */

const DISABLE_KEYTAR = process.env.DISABLE_KEYTAR === 'true'

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
    /** @type {(FILTransaction|FILTransactionProcessing)[]} */
    this.transactions = []
    this.disableKeytar = disableKeytar
    this.onTransactionUpdate = onTransactionUpdate
  }

  async setup () {
    const { seed, isNew } = await this.getSeedPhrase()
    // TODO: Do all those values need to be stored?
    this.provider = new ethers.providers.JsonRpcProvider('https://api.node.glif.io/rpc/v0')
    this.signer = ethers.Wallet.fromMnemonic(seed).connect(this.provider)
    this.address = this.signer.address
    this.addressDelegated = delegatedFromEthAddress(this.address, CoinType.MAIN)
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

    seed = generateMnemonic()
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
   * @returns Promise<ethers.BigNumber>
   */
  async getGasLimit (to, amount) {
    console.log('getGasLimit()', { to, amount })
    assert(this.provider)
    const [gasLimit, feeData] = await Promise.all([
      this.provider.estimateGas({
        to,
        value: amount
      }),
      this.provider.getFeeData()
    ])
    assert(feeData.maxFeePerGas, 'maxFeePerGas not found')
    return gasLimit.mul(feeData.maxFeePerGas)
  }

  /**
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @returns {Promise<string>}
   */
  async transferFunds (to, amount) {
    assert(this.signer)

    /** @type {FILTransactionProcessing} */
    const transaction = {
      timestamp: new Date().getTime(),
      status: 'processing',
      outgoing: true,
      amount: ethers.utils.formatUnits(amount, 18),
      address: delegatedFromEthAddress(to, CoinType.MAIN)
    }
    this.transactions.push(transaction)
    this.onTransactionUpdate()

    try {
      const gasLimit = await this.getGasLimit(to, amount)
      console.log({ gasLimit })
      // Ensure transaction has enough gas to succeed
      const gasOffset = ethers.BigNumber.from('100')
      const amountMinusGas = amount.sub(gasLimit).sub(gasOffset)
      const tx = await this.signer.sendTransaction({
        to,
        value: amountMinusGas
      })
      console.log({ tx })
      const hash = tx.hash
      assert(hash, 'Transaction hash not found')
      const cid = await this.convertEthTxHashToCid(hash)
      console.log({ hash, cid })
      transaction.hash = cid
      this.onTransactionUpdate()

      return cid
    } catch (err) {
      console.error(err)
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
    console.log('convertEthTxHashToCid', { hash })
    for (let i = 0; i < 10; i++) {
      const res = await fetch('https://graph.glif.link/query', {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,de;q=0.8',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'Message',
          variables: {
            cid: hash
          },
          query: 'query Message($cid: String!) {message(cid: $cid) {cid}}'
        }),
        method: 'POST'
      })
      const body = await res.json()
      if (body.data.message) {
        return body.data.message.cid
      }
      console.log(body.errors)
      await new Promise(resolve => setTimeout(resolve, 10_000))
    }
    throw new Error('Could not convert ETH tx hash to CID')
  }

  /**
   * @param {string} address
   * @returns Promise<GQLMessage[]>
   */
  async getMessages (address) {
    const url = `https://filfox.info/api/v1/address/${address}/messages?pageSize=1000000`
    const res = await fetch(url)
    /** @type {{messages: FoxMessage[] | null}} */
    const { messages } = /** @type {any} */ (await res.json())
    return messages || []
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
        hash: message.cid,
        outgoing: message.from === this.addressDelegated,
        amount: ethers.utils.formatUnits(message.value, 18),
        address: message.from === this.addressDelegated
          ? message.to
          : message.from,
        timestamp: message.timestamp * 1000,
        status: message.receipt.exitCode === 0 ? 'succeeded' : 'failed'
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
}

module.exports = {
  WalletBackend
}
