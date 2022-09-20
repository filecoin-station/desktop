'use strict'

const Store = require('electron-store')

const jobCounterStore = new Store({
  name: 'job-counters'
})

class JobCounter {
  #moduleCounters

  constructor () {
    this.#moduleCounters = loadStoredCounters()
  }

  getNumberOfAllJobsProcessed () {
    return Object.values(this.#moduleCounters).reduce((sum, value) => sum + value, 0)
  }

  /**
   * @param {string} moduleName
   * @param {number} count
   */
  setJobsProcessedByModule (moduleName, count) {
    this.#moduleCounters[moduleName] = count
    this.#save()
  }

  reset () {
    this.#moduleCounters = {}
    this.#save()
  }

  #save () {
    storeCounters(this.#moduleCounters)
  }
}

/**
 * @returns {import('./typings').ModuleJobCount}
 */
function loadStoredCounters () {
  // A workaround to fix false TypeScript errors
  return /** @type {any} */(jobCounterStore.get('counters', {}))
}

/**
 * @param {import('./typings').ModuleJobCount} counters
 */
function storeCounters (counters) {
  jobCounterStore.set('counters', counters)
}

module.exports = {
  JobCounter
}
