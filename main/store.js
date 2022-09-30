'use strict'

const Store = require('electron-store')
const { randomUUID } = require('crypto')

const store = new Store({
  defaults: {
    stationID: randomUUID()
  }
})

const keys = {
  stationID: 'stationID'
}

const stationID = /** @type {string} */ (store.get(keys.stationID))

/**
 * @returns {string}
 */
function getStationID () {
  return stationID
}

module.exports = {
  getStationID
}
