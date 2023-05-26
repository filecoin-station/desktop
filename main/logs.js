'use strict'

class Logs {
  /**  @type {string[]} */
  #logs = []

  /**
   * Keep last 100 lines of logs for inspection
   * @param {string} lines
   */
  push (lines) {
    this.#logs.push(...lines.split('\n').filter(Boolean))
    this.#logs.splice(0, this.#logs.length - 100)
  }

  get () {
    return this.getLast(Infinity)
  }

  /**
   * @param {number} n
   * @returns string
   */
  getLast (n) {
    return this.#logs.slice(-n).join('\n')
  }
}

module.exports = {
  Logs
}
