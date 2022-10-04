'use strict'

const assert = require('assert').strict

/** @template {object} Obj
 * @template {keyof Obj} Props
 * @param {Obj} data
 * @param {Props[]} propNames
 * @returns {Pick<Obj, Props>}
 */
function pickProps (data, ...propNames) {
  /** @type {(string | number | symbol)[]} */
  const names = propNames
  /** @type {any} */
  const result = {}
  for (const key in data) {
    if (names.includes(key)) {
      result[key] = data[key]
    }
  }
  return result
}

/**
 * @param {string} valueDescription
 * @param {number} actualValue
 * @param {number} maxDeltaInMs
 */
function assertTimestampIsCloseToNow (actualValue, valueDescription = 'timestamp', maxDeltaInMs = 200) {
  const now = Date.now()
  const delta = Math.abs(actualValue - now)

  const nowStr = new Date(now).toISOString()
  const actualStr = new Date(actualValue).toISOString()

  assert(
    delta < maxDeltaInMs,
    `Expected ${valueDescription} to be within ${maxDeltaInMs}ms from ${nowStr}, ` +
      `but got ${actualStr} instead (differs by ${delta}ms).`
  )
}

module.exports = {
  pickProps,
  assertTimestampIsCloseToNow
}
