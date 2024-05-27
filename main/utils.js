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
  'https://github.com/filecoin-station/spark',
  'https://beryx.zondax.ch',
  'https://beryx.io',
  'https://pl-strflt.notion.site'
].map(str => new URL(str))

/**
   * @param {string} url
*/
function validateExternalURL (url) {
  const normalizedURL = new URL(url).href
  assert(allowedURLs.find(item => normalizedURL.startsWith(item.href)))
}

module.exports = {
  formatTokenValue,
  validateExternalURL
}
