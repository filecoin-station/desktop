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
    this.#detectChangeInOnlineStatus(activity)
    ctx.recordActivity(activity)
  }

  /**
   * @param {Activity} activity
   */
  #detectChangeInOnlineStatus (activity) {
    if (
      activity.type === 'info' &&
      (activity.message === 'SPARK started reporting retrievals' ||
      activity.message === 'SPARK retrieval reporting resumed')
    ) {
      this.#online = true
    } else if (activity.message === 'SPARK failed reporting retrieval') {
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
