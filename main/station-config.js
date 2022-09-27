'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  OnboardingCompleted: 'station.onboardingCompleted',
  TrayOperationDialogShown: 'station.trayOperationDialogShown'
}

let OnboardingCompleted = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.OnboardingCompleted))
let TrayOperationDialogShown = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.TrayOperationDialogShown))

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
function getTrayOperationDialogShown () {
  return !!TrayOperationDialogShown
}

/**
 *
 */
function setTrayOperationDialogShown () {
  TrayOperationDialogShown = true
  configStore.set(ConfigKeys.TrayOperationDialogShown, TrayOperationDialogShown)
}

module.exports = {
  getOnboardingCompleted,
  setOnboardingCompleted,
  getTrayOperationDialogShown,
  setTrayOperationDialogShown
}
