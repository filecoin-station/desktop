'use strict'

class LogLines {
  /**  @type {string[]} */
  #logLines = []

  /**
   * Keep last 100 lines of logs for inspection
   * @param {string} line
   */
  push (line) {
    this.#logLines.push(line)
    this.#logLines.splice(0, this.#logLines.length - 100)
  }

  get () {
    return this.getLast(Infinity)
  }

  /**
   * @param {number} n
   * @returns string
   */
  getLast (n) {
    return this.#logLines.slice(-n).join('\n')
  }
}

module.exports = {
  LogLines
}
