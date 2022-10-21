'use strict'

const Store = require('electron-store')
const { Point } = require('@influxdata/influxdb-client')
const { getFilAddress } = require('./station-config')
const { createHash } = require('node:crypto')
const { getStationID } = require('./station-config')
const { writeClient } = require('./telemetry')

/** @typedef {import('./typings').ModuleJobStatsMap} ModuleJobStatsMap */

const jobStatsStore = new Store({
  name: 'job-stats'
})

class JobStats {
  #perModuleJobStats

  constructor () {
    this.#perModuleJobStats = loadStoredStats()
  }

  getTotalJobsCompleted () {
    return Object.values(this.#perModuleJobStats).reduce((sum, value) => sum + value, 0)
  }

  /**
   * @param {string} moduleName
   * @param {number} count
   */
  setModuleJobsCompleted (moduleName, count) {
    const filAddress = getFilAddress()
    if (filAddress && moduleName in this.#perModuleJobStats) {
      const diff = count - this.#perModuleJobStats[moduleName]
      if (diff > 0) {
        writeClient.writePoint(
          new Point('jobs-completed')
            .stringField('module', moduleName)
            .stringField('wallet', createHash('sha256').update(filAddress).digest('hex'))
            .stringField('station', getStationID())
            .intField('value', diff)
        )
      }
    }
    this.#perModuleJobStats[moduleName] = count
    this.#save()
  }

  reset () {
    this.#perModuleJobStats = {}
    this.#save()
  }

  #save () {
    storeStats(this.#perModuleJobStats)
  }
}

/**
 * @returns {ModuleJobStatsMap}
 */
function loadStoredStats () {
  // A workaround to fix false TypeScript errors
  return /** @type {any} */(jobStatsStore.get('stats', {}))
}

/**
 * @param {ModuleJobStatsMap} jobStatsMap
 */
function storeStats (jobStatsMap) {
  jobStatsStore.set('stats', jobStatsMap)
}

module.exports = {
  JobStats
}
