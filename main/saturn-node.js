'use strict'

const path = require('path')
const fs = require('node:fs/promises')
const { setTimeout } = require('timers/promises')

const { app } = require('electron')
const execa = require('execa')

const Store = require('electron-store')
const configStore = new Store()

const saturnBinaryPath = getSaturnBinaryPath()

/** @type {import('execa').ExecaChildProcess | null} */
let childProcess = null

let ready = false

/** @type {string} */
let childLog = ''

/** @type {string | undefined} */
let webUrl

const ConfigKeys = {
  FilAddress: 'saturn.filAddress'
}

let filAddress = /** @type {string | undefined} */ (configStore.get(ConfigKeys.FilAddress))

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
  // Recently built darwin-arm64 binaries cannot be started, they are immediately killed by SIGKILL
  // Since we don't support Apple Silicon yet, we can use x64 for now.
  // Note this is affecting only DEV. We are packaging the app for darwin-x64 only.
  const arch = process.platform === 'darwin' && process.arch === 'arm64' ? 'x64' : process.arch
  return app.isPackaged
    ? path.resolve(process.resourcesPath, 'saturn-l2-node', name)
    : path.resolve(__dirname, '..', 'build', 'saturn', `l2node-${process.platform}-${arch}`, name)
}

async function start () {
  if (!filAddress) {
    console.info('Saturn node requires FIL address. Please configure it in the Station UI.')
    return
  }

  console.log('Starting Saturn node...')
  if (childProcess) {
    console.log('Saturn node is already running.')
    return
  }

  childLog = ''
  appendToChildLog('Starting Saturn node')
  childProcess = execa(saturnBinaryPath, {
    env: {
      FIL_WALLET_ADDRESS: filAddress
    }
  })

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

    stdout.setEncoding('utf-8')
    stdout.on('data', (/** @type {string} */ data) => forwardChunkFromSaturn(data, console.log))

    stderr.setEncoding('utf-8')
    stderr.on('data', (/** @type {string} */ data) => {
      forwardChunkFromSaturn(data, console.error)
      appendToChildLog(data)
    })

    let output = ''
    /**
     * @param {Buffer} data
     */
    const readyHandler = data => {
      output += data.toString()

      const webuiMatch = output.match(/^WebUI: (http.*)$/m)
      if (webuiMatch) {
        webUrl = webuiMatch[1]

        appendToChildLog('Saturn node is up and ready')
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
    console.log(`Saturn node closed all stdio with code ${code ?? '<no code>'}`)
    childProcess?.stderr?.removeAllListeners()
    childProcess?.stdout?.removeAllListeners()
    childProcess = null
  })

  childProcess.on('exit', (code, signal) => {
    const reason = signal ? `via signal ${signal}` : `with code: ${code}`
    const msg = `Saturn node exited ${reason}`
    console.log(msg)
    appendToChildLog(msg)

    ready = false
  })

  try {
    await Promise.race([
      readyPromise,
      setTimeout(500)
    ])
  } catch (err) {
    const msg = err instanceof Error ? err.message : '' + err
    appendToChildLog(`Cannot start Saturn node: ${msg}`)
    console.error('Cannot start Saturn node:', err)
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

function getLog () {
  return childLog
}

/**
 * @returns {string | undefined}
 */
function getFilAddress () {
  return filAddress
}

/**
 * @param {string | undefined} address
 */
function setFilAddress (address) {
  filAddress = address
  configStore.set(ConfigKeys.FilAddress, address)
}

/**
 * @param {string} chunk
 * @param {console["log"] | console["error"]} log
 */
function forwardChunkFromSaturn (chunk, log) {
  const lines = chunk.trimEnd().split(/\n/g)
  for (const ln of lines) {
    log('[SATURN] %s', ln)
  }
}

/**
 * @param {string} text
 */
function appendToChildLog (text) {
  childLog += text
    .trimEnd()
    .split(/\n/g)
    .map(line => `[${new Date().toLocaleTimeString()}] ${line}\n`)
    .join('')
}

module.exports = {
  setup,
  start,
  stop,
  isRunning,
  isReady,
  getLog,
  getWebUrl,
  getFilAddress,
  setFilAddress
}
