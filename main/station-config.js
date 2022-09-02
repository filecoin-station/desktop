'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  // FilAddress: 'station.filAddress',
  OnboardingCompleted: 'station.sawOnborading',
  UserConsent: 'station.userConsent',
}

// let filAddress = /** @type {string | undefined} */ (configStore.get(ConfigKeys.FilAddress))
let OnboardingCompleted = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.OnboardingCompleted))
let userConsent = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.UserConsent))

// /**
//  * @returns {string | undefined}
//  */
//  function getFilAddress () {
//   return filAddress
// }

// /**
//  * @param {string | undefined} address
//  */
// function setFilAddress (address) {
//   filAddress = address
//   configStore.set(ConfigKeys.FilAddress, address)
// }

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
  // getFilAddress,
  // setFilAddress,
  getOnboardingCompleted,
  setOnboardingCompleted,
  getUserConsent,
  setUserConsent
}
