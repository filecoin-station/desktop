'use strict'

const { app } = require('electron')
const path = require('path')
const fs = require('node:fs/promises')

module.exports = async function setupSaturnNode (/** @type {import('./typings').Context} */ ctx) {
  const saturnBinaryPath = getSaturnBinaryPath()
  console.log('Using Saturn L2 Node binary: %s', saturnBinaryPath)

  const stat = await fs.stat(saturnBinaryPath)
  if (!stat) {
    throw new Error(`Invalid configuration or deployment. Saturn L2 Node was not found: ${saturnBinaryPath}`)
  }

  console.log('todo: start saturn node')
}

function getSaturnBinaryPath () {
  const name = 'saturn-l2' + (process.platform === 'win32' ? '.exe' : '')
  return app.isPackaged
    ? path.resolve(process.resourcesPath, 'saturn-l2-node', name)
    : path.resolve(__dirname, '..', 'build', 'saturn', `l2node-${process.platform}-${process.arch}`, name)
}
