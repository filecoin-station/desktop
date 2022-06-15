'use strict'

const path = require('path')
const fs = require('node:fs/promises')
const { setTimeout } = require('timers/promises')

const { app } = require('electron')
const execa = require('execa')

const saturnBinaryPath = getSaturnBinaryPath()

/** @type {import('execa').ExecaChildProcess | null} */
let childProcess = null

let ready = false

/** @type {string | undefined} */
let webUrl

async function setup (/** @type {import('./typings').Context} */ _ctx) {
  console.log('Using Saturn L2 Node binary: %s', saturnBinaryPath)

  const stat = await fs.stat(saturnBinaryPath)
  if (!stat) {
    throw new Error(`Invalid configuration or deployment. Saturn L2 Node was not found: ${saturnBinaryPath}`)
  }

  app.on('before-quit', () => {
    if (!childProcess) return
    stop()
  })
  await start()
}

function getSaturnBinaryPath () {
  const name = 'saturn-l2' + (process.platform === 'win32' ? '.exe' : '')
  return app.isPackaged
    ? path.resolve(process.resourcesPath, 'saturn-l2-node', name)
    : path.resolve(__dirname, '..', 'build', 'saturn', `l2node-${process.platform}-${process.arch}`, name)
}

async function start () {
  console.log('Starting Saturn node...')
  if (childProcess) {
    console.log('Saturn node is already running.')
    return
  }

  childProcess = execa(saturnBinaryPath)

  /** @type {Promise<void>} */
  const readyPromise = new Promise(function startSaturnNodeChildProcess (resolve, reject) {
    if (!childProcess) {
      throw new Error('Unexpected error: child process is undefined after startup')
    }

    const { stdout, stderr } = childProcess

    if (!stderr) {
      throw new Error('stderr was not defined on child process')
    }

    if (!stdout) {
      throw new Error('stderr was not defined on child process')
    }

    stdout.on('data', data => forwardChunkFromSaturn(data, console.log))
    stderr.on('data', data => forwardChunkFromSaturn(data, console.error))

    let output = ''
    /**
     * @param {Buffer} data
     */
    const readyHandler = data => {
      output += data.toString()

      const webuiMatch = output.match(/^WebUI: (http.*)$/m)
      if (webuiMatch) {
        webUrl = webuiMatch[1]

        console.log('Saturn node is up and ready (Web URL: %s)', webUrl)
        ready = true
        stdout.off('data', readyHandler)
        resolve()
      }
    }
    stdout.on('data', readyHandler)

    childProcess.catch(reject)
  })

  childProcess.on('close', code => {
    console.log(`Saturn node closed all stdio with code ${code}`)
  })

  childProcess.on('exit', (code, signal) => {
    console.log(`Saturn node exited with code ${code} signal ${signal}`)
    childProcess?.stderr?.removeAllListeners()
    childProcess?.stdout?.removeAllListeners()
    childProcess = null
    ready = false
  })

  try {
    await Promise.race([
      readyPromise,
      setTimeout(500)
    ])
  } catch (err) {
    const error = err instanceof Error ? err : new Error('' + err)
    error.message = `Cannot start Saturn node: ${error.message}`
    throw error
  }
}

function stop () {
  console.log('Stopping Saturn node')
  if (!childProcess) {
    console.log('Saturn node was not running')
    return
  }

  childProcess.kill()
  childProcess = null
}

function isRunning () {
  return !!childProcess
}

function isReady () {
  return ready
}

function getWebUrl () {
  return webUrl
}

/**
 * @param {Buffer} chunk
 * @param {console["log"] | console["error"]} log
 */
function forwardChunkFromSaturn (chunk, log) {
  const lines = chunk.toString().split(/\n/g)
  for (const ln of lines) {
    log('[SATURN] %s', ln)
  }
}

module.exports = {
  setup,
  start,
  stop,
  isRunning,
  isReady,
  getWebUrl
}
