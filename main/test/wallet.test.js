'use strict'

const {
  getTransactionsForUI,
  formatWithSixDecimalDigits
} = require('../wallet')
const assert = require('assert').strict
const ethers = require('ethers')

/** @typedef {import('../typings').FILTransactionStatus} FILTransactionStatus */

const processingOutgoing = {
  status: /** @type {FILTransactionStatus} */ ('processing'),
  outgoing: true,
  timestamp: Date.now(),
  amount: '0',
  address: '0'
}

const processingOutgoing2 = {
  status: /** @type {FILTransactionStatus} */ ('processing'),
  outgoing: true,
  timestamp: Date.now(),
  amount: '0',
  address: '0'
}

const processingIncoming = {
  status: /** @type {FILTransactionStatus} */ ('processing'),
  outgoing: false,
  timestamp: Date.now(),
  amount: '0',
  address: '0'
}

const succeeded = {
  status: /** @type {FILTransactionStatus} */ ('succeeded'),
  outgoing: true,
  timestamp: Date.now(),
  amount: '0',
  address: '0'
}

const succeeded2 = {
  status: /** @type {FILTransactionStatus} */ ('succeeded'),
  outgoing: true,
  timestamp: Date.now(),
  amount: '0',
  address: '0'
}

const failed = {
  status: /** @type {FILTransactionStatus} */ ('failed'),
  outgoing: true,
  timestamp: Date.now(),
  amount: '0',
  address: '0'
}

describe('Wallet', function () {
  describe('getTransactionsForUI()', function () {
    it('lists processing and succeeded transactions', function () {
      assert.deepStrictEqual(
        getTransactionsForUI([
          succeeded,
          processingIncoming,
          processingOutgoing,
          processingOutgoing2,
          succeeded2,
          failed
        ]),
        [
          processingOutgoing,
          succeeded,
          succeeded2
        ]
      )
    })
    it('lists only processing transactions', function () {
      assert.deepStrictEqual(
        getTransactionsForUI([
          processingIncoming,
          processingOutgoing,
          processingOutgoing2
        ]),
        [
          processingOutgoing
        ]
      )
    })
    it('lists only succeeded transactions', function () {
      assert.deepStrictEqual(
        getTransactionsForUI([
          succeeded,
          succeeded2,
          failed
        ]),
        [
          succeeded,
          succeeded2
        ]
      )
    })
  })
})

describe('formatWithSixDecimalDigits', function () {
  it('keeps six decimal digits only', function () {
    assert.strictEqual(
      formatWithSixDecimalDigits(ethers.BigNumber.from('1654759687033008')),
      '0.001654'
    )
  })

  it('rounds down', function () {
    assert.strictEqual(
      formatWithSixDecimalDigits(ethers.BigNumber.from('1999999999999999')),
      '0.001999'
    )
  })

  it('strips trailing zeroes after rounding down', function () {
    assert.strictEqual(
      formatWithSixDecimalDigits(ethers.BigNumber.from('1000000000000001')),
      '0.001'
    )
  })
  it('strips trailing zeroes when no rounding is needed', function () {
    assert.strictEqual(
      formatWithSixDecimalDigits(ethers.BigNumber.from('1000000000000000')),
      '0.001'
    )
  })

  it('preserves .0 at the end', function () {
    assert.strictEqual(
      formatWithSixDecimalDigits(ethers.BigNumber.from('1000000000000000000')),
      '1.0'
    )
  })
})
