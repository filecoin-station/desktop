'use strict'

const Store = require('electron-store')
const { randomUUID } = require('crypto')

const ConfigKeys = {
  OnboardingCompleted: 'station.onboardingCompleted',
  TrayOperationExplained: 'station.TrayOperationExplained',
  StationID: 'station.StationID'
}

const configStore = new Store({
  defaults: {
    [ConfigKeys.OnboardingCompleted]: false,
    [ConfigKeys.TrayOperationExplained]: false,
    [ConfigKeys.StationID]: randomUUID()
  }
})

console.log('Loading Station configuration from', configStore.path)

let OnboardingCompleted = /** @type {boolean} */ (configStore.get(ConfigKeys.OnboardingCompleted))
let TrayOperationExplained = /** @type {boolean} */ (configStore.get(ConfigKeys.TrayOperationExplained))
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
  getStationID
}
