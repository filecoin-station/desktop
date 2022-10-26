'use strict'

const Store = require('electron-store')
const { randomUUID } = require('crypto')

const ConfigKeys = {
  OnboardingCompleted: 'station.OnboardingCompleted',
  TrayOperationExplained: 'station.TrayOperationExplained',
  StationID: 'station.StationID',
  FilAddress: 'station.FilAddress'
}

// Use this to test migrations
// https://github.com/sindresorhus/electron-store/issues/205
require('electron').app.setVersion('0.9.1')

const configStore = new Store({
  defaults: {
    [ConfigKeys.OnboardingCompleted]: false,
    [ConfigKeys.TrayOperationExplained]: false,
    [ConfigKeys.StationID]: randomUUID()
  },
  migrations: {
    '>=0.9.0': store => {
      if (store.has('station.onboardingCompleted')) {
        console.log('has onboardingcompleted')
        store.set('station.OnboardingCompleted', store.get('station.onboardingCompleted'))
      }
      if (store.has('saturn.filAddress')) {
        console.log('has filaddress')
        store.set('station.filAddress', store.get('saturn.filAddress'))
      }
    }
  },
  beforeEachMigration: (_, context) => {
    console.log(`Migrating station-config from ${context.fromVersion} → ${context.toVersion}`)
  }
})

console.log('Loading Station configuration from', configStore.path)

let OnboardingCompleted = /** @type {boolean} */ (configStore.get(ConfigKeys.OnboardingCompleted))
let TrayOperationExplained = /** @type {boolean} */ (configStore.get(ConfigKeys.TrayOperationExplained))
let FilAddress = /** @type {string | undefined} */ (configStore.get(ConfigKeys.FilAddress))
const StationID = /** @type {string} */ (configStore.get(ConfigKeys.StationID))

/**
 * @returns {boolean}
 */
function getOnboardingCompleted () {
  return !!OnboardingCompleted
}

/**
 *
 */
function setOnboardingCompleted () {
  OnboardingCompleted = true
  configStore.set(ConfigKeys.OnboardingCompleted, OnboardingCompleted)
}

/**
 * @returns {boolean}
 */
function getTrayOperationExplained () {
  return !!TrayOperationExplained
}

/**
 *
 */
function setTrayOperationExplained () {
  TrayOperationExplained = true
  configStore.set(ConfigKeys.TrayOperationExplained, TrayOperationExplained)
}

/**
 * @returns {string | undefined}
 */
function getFilAddress () {
  return FilAddress
}

/**
 * @param {string | undefined} address
 */
function setFilAddress (address) {
  FilAddress = address
  configStore.set(ConfigKeys.FilAddress, address)
}

/**
 * @returns {string}
 */
function getStationID () {
  return StationID
}

module.exports = {
  getOnboardingCompleted,
  setOnboardingCompleted,
  getTrayOperationExplained,
  setTrayOperationExplained,
  getFilAddress,
  setFilAddress,
  getStationID
}
