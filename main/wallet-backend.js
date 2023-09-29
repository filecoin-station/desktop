'use strict'

const keytar = require('keytar')
// TODO: Replace with ethers tooling
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { strict: assert } = require('node:assert')
const { ethers } = require('ethers')

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
   * @param {string} from
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @returns Promise<FilecoinNumber>
   */
  async getGasLimit (from, to, amount) {
    // assert(this.provider)
    // const message = new Message({
    //   to,
    //   from,
    //   nonce: 0,
    //   value: amount.toAttoFil(),
    //   method: 0,
    //   params: '',
    //   gasPremium: 0,
    //   gasFeeCap: 0,
    //   gasLimit: 0
    // })
    // const messageWithGas = await this.provider.gasEstimateMessageGas(
    //   message.toLotusType()
    // )
    // const feeCapStr = messageWithGas.gasFeeCap.toFixed(0, BigNumber.ROUND_CEIL)
    // const feeCap = new FilecoinNumber(feeCapStr, 'attofil')
    // const gas = feeCap.times(messageWithGas.gasLimit)
    // return gas
    return 0
  }

  /**
   * @param {string} from
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @returns {Promise<string>}
   */
  async transferFunds (from, to, amount) {
    // assert(this.provider)

    // /** @type {FILTransactionProcessing} */
    // const transaction = {
    //   timestamp: new Date().getTime(),
    //   status: 'processing',
    //   outgoing: true,
    //   amount: amount.toString(),
    //   address: to
    // }
    // this.transactions.push(transaction)
    // this.onTransactionUpdate()

    // try {
    //   const gasLimit = await this.getGasLimit(from, to, amount)
    //   // Ensure transaction has enough gas to succeed
    //   const gasOffset = new FilecoinNumber('100', 'attofil')
    //   const amountMinusGas = amount.minus(gasLimit).minus(gasOffset)
    //   const message = new Message({
    //     to,
    //     from,
    //     nonce: await this.provider.getNonce(from),
    //     value: amountMinusGas.toAttoFil(),
    //     method: 0,
    //     params: ''
    //   })
    //   const messageWithGas = await this.provider.gasEstimateMessageGas(
    //     message.toLotusType()
    //   )
    //   const lotusMessage = messageWithGas.toLotusType()
    //   const msgValid = await this.provider.simulateMessage(lotusMessage)
    //   assert(msgValid, 'Message is invalid')
    //   const signedMessage = await this.provider.wallet.sign(from, lotusMessage)
    //   const { '/': cid } = await this.provider.sendMessage(signedMessage)

    //   transaction.hash = cid
    //   this.onTransactionUpdate()

    //   return cid
    // } catch (err) {
    //   console.error(err)
    //   transaction.status = 'failed'
    //   this.onTransactionUpdate()

    //   throw err
    // }
    return 'TODO'
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
    const transactions = messages.map(message => ({
      height: message.height,
      hash: message.cid,
      outgoing: message.from === this.address,
      amount: ethers.utils.formatUnits(message.value, 18),
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
