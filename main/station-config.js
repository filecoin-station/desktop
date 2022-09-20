'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  OnboardingCompleted: 'station.onboardingCompleted'
}

let OnboardingCompleted = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.OnboardingCompleted))

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

module.exports = {
  getOnboardingCompleted,
  setOnboardingCompleted
}
