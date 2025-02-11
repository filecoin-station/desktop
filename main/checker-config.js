'use strict'

const Store = require('electron-store')

const log = require('electron-log').scope('config')

const ConfigKeys = {
  OnboardingCompleted: 'checker.OnboardingCompleted',
  TrayOperationExplained: 'checker.TrayOperationExplained',
  CheckerID: 'checker.CheckerID',
  FilAddress: 'checker.FilAddress',
  DestinationFilAddress: 'checker.DestinationFilAddress'
}

// Use this to test migrations
// https://github.com/sindresorhus/electron-store/issues/205
// require('electron').app.setVersion('9999.9.9')

const configStore = new Store({
  migrations: {
    '>=3.0.0': store => {
      const migration = [
        {
          from: 'station.OnboardingCompleted',
          to: ConfigKeys.OnboardingCompleted
        }, {
          from: 'station.TrayOperationExplained',
          to: ConfigKeys.TrayOperationExplained
        }, {
          from: 'station.stationID',
          to: ConfigKeys.CheckerID
        }, {
          from: 'station.FilAddress',
          to: ConfigKeys.FilAddress
        }, {
          from: 'station.DestinationFilAddress',
          to: ConfigKeys.DestinationFilAddress
        }
      ]
      for (const { from, to } of migration) {
        if (store.has(from)) {
          store.set(to, store.get(from))
        }
      }
    },
    '>=0.9.0': store => {
      if (store.has('station.onboardingCompleted')) {
        store.set(
          ConfigKeys.OnboardingCompleted,
          store.get('station.onboardingCompleted')
        )
      }
      if (store.has('saturn.filAddress')) {
        store.set(ConfigKeys.FilAddress, store.get('saturn.filAddress'))
      }
    }
  },
  beforeEachMigration: (_, context) => {
    log.info(
      `Migrating checker-config from ${context.fromVersion} → ` +
        context.toVersion
    )
  }
})

log.info('Loading Checker configuration from', configStore.path)

let OnboardingCompleted =
  /** @type {boolean} */
  (configStore.get(ConfigKeys.OnboardingCompleted, false))
let TrayOperationExplained =
  /** @type {boolean} */
  (configStore.get(ConfigKeys.TrayOperationExplained, false))
let DestinationFilAddress =
  /** @type {string | undefined} */
  (configStore.get(ConfigKeys.DestinationFilAddress))

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
function getDestinationWalletAddress () {
  return DestinationFilAddress
}

/**
 * @param {string | undefined} address
 */
function setDestinationWalletAddress (address) {
  DestinationFilAddress = address
  configStore.set(ConfigKeys.DestinationFilAddress, DestinationFilAddress)
}

module.exports = {
  getOnboardingCompleted,
  setOnboardingCompleted,
  getTrayOperationExplained,
  setTrayOperationExplained,
  getDestinationWalletAddress,
  setDestinationWalletAddress
}
