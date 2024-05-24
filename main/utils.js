'use strict'

const assert = require('node:assert')

/**
   * @param {string | number | undefined} input
   * @returns {number}
*/
// Keep in sync with renderer/src/number-ops.ts
function formatTokenValue (input) {
  const number = Number(input)
  if (!input) return 0
  if (Number.isInteger(number)) return number
  // decimal cases below
  return Number(number.toFixed(6))
}

const allowedURLs = [
  'https://filspark.com/',
  'https://github.com/filecoin-station/voyager',
  'https://filstation.app/',
  'https://github.com/filecoin-station/spark'
]
/**
   * @param {string} url
*/
function validateExternalURL (url) {
  assert(allowedURLs.includes(url))
}

module.exports = {
  formatTokenValue,
  validateExternalURL
}
