'use strict'

const Store = require('electron-store')
const configStore = new Store({
  name: 'activity-log'
})

class ActivityLog {
  #entries
  #lastId

  constructor () {
    this.#entries = loadStoredEntries()
    this.#lastId = this.#entries
      // We are storing ids as strings to allow us to switch to GUIDs in the future if needed
      // When looking for the max id used, we need to cast strings to numbers.
      .map(e => +e.id)
      // Find the maximum id or return 0 when no events were recorded yet
      .reduce((max, it) => it > max ? it : max, 0)
  }

  /**
   * @param {import('./typings').ActivityEvent} args
   * @returns {import('./typings').ActivityEntry}
   */
  recordEvent ({ source, type, message }) {
    const nextId = ++this.#lastId
    /** @type {import('./typings').ActivityEntry} */
    const entry = {
      id: '' + nextId,
      timestamp: Date.now(),
      source,
      type,
      message
    }
    this.#entries.push(entry)
    this.#save()
    // Clone the data to prevent the caller from accidentally changing our store
    return clone(entry)
  }

  getAllEntries () {
    // Clone the data to prevent the caller from accidentally changing our store
    return this.#entries.map(clone)
  }

  static reset () {
    const self = new ActivityLog()
    self.#entries = []
    self.#save()
  }

  #save () {
    configStore.set('events', this.#entries)
  }
}

/**
 * TODO: use `structuredClone` (available from Node.js v17/v18, not supported by Electron yet)
 *
 * @template {object} T
 * @param {T} data
 * @returns {T}
 */
function clone (data) {
  return { ...data }
}

/**
 * @returns {import('./typings').ActivityEntry[]}
 */
function loadStoredEntries () {
  // A workaround to fix false TypeScript errors
  return /** @type {any} */(configStore.get('events', []))
}

module.exports = {
  ActivityLog
}
