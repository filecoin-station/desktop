'use strict'

/**
   * @param {string | number | undefined} input
   * @returns {number}
*/
function formatTokenValue (input) {
  const number = Number(input)
  if (!input) return 0
  if (Number.isInteger(number)) return number
  // decimal cases below
  return Number(number.toFixed(6))
}

module.exports = {
  formatTokenValue
}
