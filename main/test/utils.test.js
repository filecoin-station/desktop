'use strict'

const { formatTokenValue } = require('../utils')
const assert = require('assert').strict

describe('formatTokenValue', function () {
  it('should correctly round a typical value', function () {
    const input = 0.004567687
    const expectedOutput = 0.004568
    const result = formatTokenValue(input)
    assert.equal(result, expectedOutput)
  })

  it('should reduce a big number to 6 decimal places',
    function () {
      const input = 123.45678923456
      const expectedOutput = 123.456789
      const result = formatTokenValue(input)
      assert.equal(result, expectedOutput)
    })

  it('should reduce a very small number to 6 decimal places',
    function () {
      const input = 0.000123456789
      const expectedOutput = 0.000123
      const result = formatTokenValue(input)
      assert.equal(result, expectedOutput)
    })

  it('should round up', function () {
    const input = 0.0001289
    const expectedOutput = 0.000129
    const result = formatTokenValue(input)
    assert.equal(result, expectedOutput)
  })

  it('should map 0 to 0', function () {
    const input = 0
    const expectedOutput = 0
    const result = formatTokenValue(input)
    assert.equal(result, expectedOutput)
  })

  it('should leave a big integer alone', function () {
    const input = 123456789
    const expectedOutput = 123456789
    const result = formatTokenValue(input)
    assert.equal(result, expectedOutput)
  })

  it('should show 6 decimal places for numbers smaller than 0.000001',
    function () {
      const input = 0.000000000123456789
      const expectedOutput = 0.000000
      const result = formatTokenValue(input)
      assert.equal(result, expectedOutput)
    })

  it('should not add zeroes to a number that is has no trailing zeroes',
    function () {
      const input = 123.4
      const expectedOutput = 123.4
      const result = formatTokenValue(input)
      assert.equal(result, expectedOutput)
    })
})
