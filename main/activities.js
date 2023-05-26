'use strict'

const assert = require('node:assert')

/** @typedef {import('./typings').Activity} Activity */
/** @typedef {import('./typings').Context} Context */

class Activities {
  /** @type {Activity[]} */
  #activities = []
  /** @type {Context?} */
  #ctx = null
  #online = false

  /**
   * @param {Context} ctx
   */
  constructor (ctx) {
    this.#ctx = ctx
  }

  /**
   * Display last 100 activities
   * @param {Activity} activity
   */
  push (activity) {
    assert(this.#ctx)
    this.#activities.push(activity)
    this.#activities.splice(0, this.#activities.length - 100)
    this.#ctx.recordActivity(activity)
    this.#detectChangeInOnlineStatus(activity)
  }

  /**
   * @param {Activity} activity
   */
  #detectChangeInOnlineStatus (activity) {
    if (
      activity.type === 'info' &&
      activity.message.includes('Saturn Node is online')
    ) {
      this.#online = true
    } else if (
      activity.message === 'Saturn Node started.' ||
      activity.message.includes('was able to connect') ||
      activity.message.includes('will try to connect')
    ) {
      this.#online = false
    }
  }

  get () {
    return [...this.#activities]
  }

  isOnline () {
    return this.#online
  }
}

module.exports = {
  Activities
}
