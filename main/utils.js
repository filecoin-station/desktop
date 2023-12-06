'use strict'

/**
 * @param { number | string | undefined } amount
 * @returns { string }
 */

exports.roundToSixDecimalPlaces = (amount) => {
  if (!amount) return '0'
  const roundedNumber = Number(amount).toFixed(6) // Round to 6 decimal places
  return roundedNumber.toString()
}
