import { BigNumber, FilecoinNumber } from '@glif/filecoin-number'
import { browseTransactionTracker } from './station-config'

export function truncateString (value: string, size = 6) {
  return `${value.slice(0, size)}...${value.slice(-size)}`
}

export function formatFilValue (value = '') {
  return new FilecoinNumber(String(value), 'fil')
    .decimalPlaces(3, BigNumber.ROUND_DOWN)
    .toString()
}

export function openExplorerLink (hash?: string) {
  if (hash) browseTransactionTracker(hash)
}
