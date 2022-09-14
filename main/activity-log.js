'use strict'

/** @typedef {import('./typings').ActivityEvent}  ActivityEvent */

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
   * @param {ActivityEvent} args
   * @returns {ActivityEvent}
   */
  recordEvent ({ source, type, message }) {
    /** @type {ActivityEvent} */
    const entry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source,
      type,
      message
    }
    // Freeze the data to prevent ActivityLog users from accidentally changing our store
    Object.freeze(entry)

    this.#entries.push(entry)

    if (this.#entries.length > 100) {
      // Delete the oldest entry to keep ActivityLog at constant size
      this.#entries.shift()
    }
    this.#save()
    return entry
  }

  getAllEntries () {
    // Clone the array to prevent the caller from accidentally changing our store
    return [...this.#entries]
  }

  static reset () {
    const self = new ActivityLog()
    self.#entries = []
    self.#save()
  }

  #save () {
    activityLogStore.set('events', this.#entries)
  }
}

/**
 * @returns {ActivityEvent[]}
 */
function loadStoredEntries () {
  // A workaround to fix false TypeScript errors
  return /** @type {any} */(activityLogStore.get('events', []))
}

module.exports = {
  ActivityLog
}
