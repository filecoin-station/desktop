'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  OnboardingCompleted: 'station.onboardingCompleted',
  UserConsent: 'station.userConsent'
}

let OnboardingCompleted = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.OnboardingCompleted))
let userConsent = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.UserConsent))

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
function getUserConsent () {
  return !!userConsent
}

/**
 * @param {boolean } consent
 */
function setUserConsent (consent) {
  userConsent = consent
  configStore.set(ConfigKeys.UserConsent, userConsent)
}

module.exports = {
  getOnboardingCompleted,
  setOnboardingCompleted,
  getUserConsent,
  setUserConsent
}
