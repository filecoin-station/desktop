'use strict'

class Logs {
  /**  @type {string[]} */
  #logs = []

  /**
   * Keep last 100 lines of logs for inspection
   * @param {string} line
   */
  pushLine (line) {
    this.#logs.push(line)
    this.#logs.splice(0, this.#logs.length - 100)
  }

  getLines () {
    return this.getLastLines(Infinity)
  }

  /**
   * @param {number} n
   * @returns string
   */
  getLastLines (n) {
    return this.#logs.slice(-n).join('\n')
  }
}

module.exports = {
  Logs
}
