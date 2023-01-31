'use strict'

const keytar = require('keytar')
const { generateMnemonic } = require('@zondax/filecoin-signing-tools')
const { default: Filecoin, HDWalletProvider } = require('@glif/filecoin-wallet-provider')
const { CoinType } = require('@glif/filecoin-address')
const { strict: assert } = require('node:assert')
const { Message } = require('@glif/filecoin-message')
const { FilecoinNumber, BigNumber } = require('@glif/filecoin-number')
const { request, gql } = require('graphql-request')

/** @typedef {import('./typings').WalletSeed} WalletSeed */
/** @typedef {import('./typings').GQLStateReplay} GQLStateReplay */
/** @typedef {import('./typings').GQLTipset} GQLTipset */

class WalletBackend {
  constructor () {
    /** @type {Filecoin | null} */
    this.provider = null
    /** @type {string | null} */
    this.address = null
    this.url = 'https://graph.glif.link/query'
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
    let seed = await keytar.getPassword(service, 'seed')
    if (seed) {
      return { seed, isNew: false }
    }

    seed = generateMnemonic()
    await keytar.setPassword(service, 'seed', seed)
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
   * @returns {Promise<void>}
   */
  async fetchAllTransactions () {
    /* ... */
  }

  /**
   * @param {string} from
   * @param {string} to
   * @param {FilecoinNumber} amount
   * @returns {Promise<string>}
   */
  async transferFunds (from, to, amount) {
    assert(this.provider)

    const gasLimit = await this.getGasLimit(from, to, amount)
    const message = new Message({
      to,
      from,
      nonce: await this.provider.getNonce(from),
      value: amount.minus(gasLimit).toAttoFil(),
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

    return cid
  }

  /**
   * @param {string} cid
   * @returns {Promise<GQLStateReplay>}
   */
  async getStateReplay (cid) {
    const query = gql`
      query StateReplay($cid: String!) {
        stateReplay(cid: $cid) {
          receipt {
            return
            exitCode
            gasUsed
          }
          executionTrace {
            executionTrace
          }
        }
      }
    `
    const variables = { cid }
    /** @type {{stateReplay: GQLStateReplay}} */
    const { stateReplay } = await request(this.url, query, variables)
    return stateReplay
  }

  /**
   * @param {number} height
   * @returns Promise<GQLTipset>
   */
  async getTipset (height) {
    const query = gql`
      query Tipset($height: Uint64!) {
        tipset(height: $height) {
          minTimestamp
        }
      }
    `
    const variables = { height }
    const { tipset } = await request(this.url, query, variables)
    return tipset
  }
}

module.exports = {
  WalletBackend
}
