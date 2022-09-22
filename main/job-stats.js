'use strict'

const Store = require('electron-store')

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
