'use strict'

const path = require('path')
const fs = require('node:fs/promises')
const { setTimeout } = require('timers/promises')

const { app } = require('electron')
const execa = require('execa')

/** @type {import('execa').ExecaChildProcess | null} */
let childProcess = null

async function setup (/** @type {import('./typings').Context} */ ctx) {
  const saturnBinaryPath = getSaturnBinaryPath()
  console.log('Using Saturn L2 Node binary: %s', saturnBinaryPath)

  const stat = await fs.stat(saturnBinaryPath)
  if (!stat) {
    throw new Error(`Invalid configuration or deployment. Saturn L2 Node was not found: ${saturnBinaryPath}`)
  }

  await start()
}

function getSaturnBinaryPath () {
  const name = 'saturn-l2' + (process.platform === 'win32' ? '.exe' : '')
  return app.isPackaged
    ? path.resolve(process.resourcesPath, 'saturn-l2-node', name)
    : path.resolve(__dirname, '..', 'build', 'saturn', `l2node-${process.platform}-${process.arch}`, name)
}

async function start () {
  if (childProcess) {
    return
  }

  const path = getSaturnBinaryPath()
  childProcess = execa(path)

  try {
    // https://github.com/sindresorhus/execa/issues/469#issuecomment-860107044
    await Promise.race([childProcess, setTimeout(0)])
  } catch (error) {
    console.error(error)
    throw error
  }

  if (childProcess.stdout) {
    childProcess.stdout.on('data', data => console.log(`stdout: ${data}`))
  }
  if (childProcess.stderr) {
    childProcess.stderr.on('data', data => console.log(`stderr: ${data}`))
  }

  childProcess.on('close', code => {
    console.log(`child process close all stdio with code ${code}`)
  })

  childProcess.on('exit', code => {
    console.log(`child process exited with code ${code}`)
    childProcess = null
  })

  // TODO: Poll http healthcheck endpoint.
  // Don't return until 1 health check succeeds, otherwise throw on timeout.
}

function stop () {
  if (!childProcess) {
    return
  }

  childProcess.kill()
  childProcess = null
}

function isOn () {
  return !!childProcess
}

module.exports = { setup, start, stop, isOn }
