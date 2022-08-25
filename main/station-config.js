'use strict'

const Store = require('electron-store')
const configStore = new Store()

const ConfigKeys = {
  // FilAddress: 'station.filAddress',
  SawOnboarding: 'station.sawOnborading',
  UserConsent: 'station.userConsent',
}

// let filAddress = /** @type {string | undefined} */ (configStore.get(ConfigKeys.FilAddress))
let sawOnboarding = /** @type {boolean | undefined} */ (configStore.get(ConfigKeys.SawOnboarding))
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
 function getSawOnboarding () {
  return !!sawOnboarding
}

/**
 * 
 */
function setSawOnboarding () {
  sawOnboarding = true
  configStore.set(ConfigKeys.SawOnboarding, sawOnboarding)
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
  getSawOnboarding,
  setSawOnboarding,
  getUserConsent,
  setUserConsent
}
