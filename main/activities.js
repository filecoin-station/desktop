'use strict'

/** @typedef {import('./typings').Activity} Activity */
/** @typedef {import('./typings').Context} Context */

class Activities {
  /** @type {Activity[]} */
  #activities = []
  #online = false

  /**
   * Display last 100 activities
   * @param {Context} ctx
   * @param {Activity} activity
   */
  push (ctx, activity) {
    this.#activities.push(activity)
    this.#activities.splice(0, this.#activities.length - 100)
    ctx.recordActivity(activity)
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
