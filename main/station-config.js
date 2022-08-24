'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  FilAddress: 'station.filAddress'
}

let filAddress = /** @type {string | undefined} */ (configStore.get(ConfigKeys.FilAddress))

/**
 * @returns {string | undefined}
 */
 function getFilAddress () {
  return filAddress
}

/**
 * @param {string | undefined} address
 */
function setFilAddress (address) {
  filAddress = address
  configStore.set(ConfigKeys.FilAddress, address)
}

module.exports = {
  getFilAddress,
  setFilAddress
}
