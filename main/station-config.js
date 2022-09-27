'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  OnboardingCompleted: 'station.onboardingCompleted',
  TrayOperationExplained: 'station.TrayOperationExplained'
}

let OnboardingCompleted = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.OnboardingCompleted))
let TrayOperationExplained = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.TrayOperationExplained))

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

module.exports = {
  getOnboardingCompleted,
  setOnboardingCompleted,
  getTrayOperationExplained,
  setTrayOperationExplained
}
