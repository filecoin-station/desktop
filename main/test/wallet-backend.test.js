'use strict'

const backend = require('../wallet-backend')
const assert = require('assert').strict

describe('Wallet Backend', function () {
  describe('getSeedPhrase', function () {
    it('gets a seed phrase', async function () {
      const { seed } = await backend.getSeedPhrase()
      assert(seed)
    })
  })
})
