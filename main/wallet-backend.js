'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const {
  default: Filecoin,
  HDWalletProvider
} = require('@glif/filecoin-wallet-provider')
const { CoinType } = require('@glif/filecoin-address')
const { strict: assert } = require('node:assert')
const { Message } = require('@glif/filecoin-message')
const { FilecoinNumber, BigNumber } = require('@glif/filecoin-number')
const { default: fetch } = require('node-fetch')

/** @typedef {import('./typings').WalletSeed} WalletSeed */
/** @typedef {import('./typings').FoxMessage} FoxMessage */
/** @typedef {import('./typings').FILTransaction} FILTransaction */
/** @typedef {import('./typings').TransactionStatus} TransactionStatus */
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
    /** @type {Filecoin | null} */
    this.provider = null
    /** @type {string | null} */
    this.address = null
    /** @type {(FILTransaction|FILTransactionProcessing)[]} */
    this.transactions = []
    this.disableKeytar = disableKeytar
    this.onTransactionUpdate = onTransactionUpdate
  }

  async setup () {
    const { seed, isNew } = await this.getSeedPhrase()
    this.provider = new Filecoin(new HDWalletProvider(seed), {
      apiAddress: 'https://api.node.glif.io/rpc/v0'
    })
    this.address = await this.getAddress()
    return { seedIsNew: isNew }
  }

  /**
   * @returns {Promise<WalletSeed>}
   */
  async getSeedPhrase () {
    const service = 'filecoin-station-wallet'
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

  async getAddress () {
    assert(this.provider)
    const [address] = await this.provider.wallet.getAccounts(
      0,
      1,
      CoinType.MAIN
    )
    return address
  }

  async fetchBalance () {
    assert(this.provider)
    assert(this.address)
    return await this.provider.getBalance(this.address)
  }

  /**
   * @param {string} from
   * @param {string} to
   * @param {FilecoinNumber} amount
   * @returns Promise<FilecoinNumber>
   */
  async getGasLimit (from, to, amount) {
    assert(this.provider)
    const message = new Message({
      to,
      from,
      nonce: 0,
      value: amount.toAttoFil(),
      method: 0,
      params: '',
      gasPremium: 0,
      gasFeeCap: 0,
      gasLimit: 0
    })
    const messageWithGas = await this.provider.gasEstimateMessageGas(
      message.toLotusType()
    )
    const feeCapStr = messageWithGas.gasFeeCap.toFixed(0, BigNumber.ROUND_CEIL)
    const feeCap = new FilecoinNumber(feeCapStr, 'attofil')
    const gas = feeCap.times(messageWithGas.gasLimit)
    return gas
  }

  /**
   * @param {string} from
   * @param {string} to
   * @param {FilecoinNumber} amount
   * @returns {Promise<string>}
   */
  async transferFunds (from, to, amount) {
    assert(this.provider)

    /** @type {FILTransactionProcessing} */
    const transaction = {
      timestamp: new Date().getTime(),
      status: 'processing',
      outgoing: true,
      amount: amount.toString(),
      address: to
    }
    this.transactions.push(transaction)
    this.onTransactionUpdate()

    try {
      console.log('getting gas limit')
      const gasLimit = await this.getGasLimit(from, to, amount)
      // Ensure transaction has enough gas to succeed
      const gasOffset = new FilecoinNumber('100', 'attofil')
      const amountMinusGas = amount.minus(gasLimit).minus(gasOffset)
      console.log({
        gasLimit: gasLimit.toFil(),
        amountMinusGas: amountMinusGas.toFil()
      })
      const message = new Message({
        to,
        from,
        nonce: await this.provider.getNonce(from),
        value: amountMinusGas.toAttoFil(),
        method: 0,
        params: ''
      })
      const messageWithGas = await this.provider.gasEstimateMessageGas(
        message.toLotusType()
      )
      const lotusMessage = messageWithGas.toLotusType()
      const msgValid = await this.provider.simulateMessage(lotusMessage)
      assert(msgValid, 'Message is invalid')
      const signedMessage = await this.provider.wallet.sign(from, lotusMessage)
      const { '/': cid } = await this.provider.sendMessage(signedMessage)

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
   * @param {string} address
   * @returns Promise<GQLMessage[]>
   */
  async getMessages (address) {
    const url = `https://filfox.info/api/v1/address/${address}/messages?pageSize=100`
    const res = await fetch(url)
    /** @type {{messages: FoxMessage[] | null}} */
    const { messages } = await res.json()
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
    const transactions = messages.map(message => ({
      height: message.height,
      hash: message.cid,
      outgoing: message.from === this.address,
      amount: new FilecoinNumber(message.value, 'attofil').toFil(),
      address: message.from === this.address
        ? message.to
        : message.from,
      timestamp: message.timestamp,
      status: message.receipt.exitCode === 0 ? 'succeeded' : 'failed'
    }))

    // Add locally known transactions not yet returned by the API
    for (const transaction of this.transactions) {
      if (!transactions.find(tx => tx.hash === transaction.hash)) {
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
