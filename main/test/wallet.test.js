'use strict'

const { getTransactionsForUI } = require('../wallet')
const assert = require('assert').strict

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
