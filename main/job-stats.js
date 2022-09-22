'use strict'

const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const Store = require('electron-store')

const client = new InfluxDB({
  url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
  // station-anonymous-write
  token: 'P9INe7-DkMB_oYSAXgw0IlBcqRc4bDi05jZFz0NZd8aApv5lieqBiN59M8cmHs6yNMRtly8_KD9RYxnyrnx8dA=='
})
const writeClient = client.getWriteApi(
  'julian.gruber@protocol.ai',
  'station',
  'ns'
)

setInterval(() => {
  writeClient.flush()
}, 1000)

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
    if (moduleName in this.#perModuleJobStats) {
      writeClient.writePoint(
        new Point('jobs-completed')
          .tag('module', moduleName)
          .intField('value', count - this.#perModuleJobStats[moduleName])
      )
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
