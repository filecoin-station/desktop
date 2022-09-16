'use strict'

/** @typedef {import('./typings').Activity} Activity */
/** @typedef {import('./typings').RecordActivityArgs}  RecordActivityArgs */

const Store = require('electron-store')
const crypto = require('node:crypto')

const activityLogStore = new Store({
  name: 'activity-log'
})

class ActivityLog {
  #entries

  constructor () {
    this.#entries = loadStoredEntries()
  }

  /**
   * @param {RecordActivityArgs} args
   * @returns {Activity}
   */
  record ({ source, type, message }) {
    /** @type {Activity} */
    const activity = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source,
      type,
      message
    }
    // Freeze the data to prevent ActivityLog users from accidentally changing our store
    Object.freeze(activity)

    this.#entries.push(activity)

    if (this.#entries.length > 100) {
      // Delete the oldest activity to keep ActivityLog at constant size
      this.#entries.shift()
    }
    this.#save()
    return activity
  }

  getAllEntries () {
    // Clone the array to prevent the caller from accidentally changing our store
    return [...this.#entries]
  }

  reset () {
    this.#entries = []
    this.#save()
  }

  #save () {
    activityLogStore.set('activities', this.#entries)
  }
}

/**
 * @returns {Activity[]}
 */
function loadStoredEntries () {
  // A workaround to fix false TypeScript errors
  return /** @type {any} */(activityLogStore.get('activities', []))
}

module.exports = {
  ActivityLog
}
