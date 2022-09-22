'use strict'

const path = require('path')
const fs = require('node:fs/promises')
const { setTimeout } = require('timers/promises')
const assert = require('node:assert')
const { fetch } = require('undici')

const { app } = require('electron')
const execa = require('execa')

const Store = require('electron-store')
const consts = require('./consts')
const configStore = new Store()

/** @typedef {import('./typings').Context} Context */

const saturnBinaryPath = getSaturnBinaryPath()

/** @type {import('execa').ExecaChildProcess | null} */
let childProcess = null

let ready = false

/** @type {string} */
let childLog = ''

/** @type {string | undefined} */
let webUrl

/** @type {string | undefined} */
let apiUrl

const ConfigKeys = {
  FilAddress: 'saturn.filAddress'
}

let filAddress = /** @type {string | undefined} */ (configStore.get(ConfigKeys.FilAddress))

/** @type {ReturnType<setInterval>} */
let pollStatsInterval

async function setup (/** @type {Context} */ ctx) {
  console.log('Using Saturn L2 Node binary: %s', saturnBinaryPath)

  const stat = await fs.stat(saturnBinaryPath)
  assert(stat, `Invalid configuration or deployment. Saturn L2 Node was not found: ${saturnBinaryPath}`)

  app.on('before-quit', () => {
    if (!childProcess) return
    stop()
  })
  await start(ctx)
}

function getSaturnBinaryPath () {
  const name = 'saturn-L2-node' + (process.platform === 'win32' ? '.exe' : '')
  // Recently built darwin-arm64 binaries cannot be started, they are immediately killed by SIGKILL
  // Since we don't support Apple Silicon yet, we can use x64 for now.
  // Note this is affecting only DEV. We are packaging the app for darwin-x64 only.
  const arch = process.platform === 'darwin' && process.arch === 'arm64' ? 'x64' : process.arch
  return app.isPackaged
    ? path.resolve(process.resourcesPath, 'saturn-l2-node', name)
    : path.resolve(__dirname, '..', 'build', 'saturn', `l2node-${process.platform}-${arch}`, name)
}

async function start (/** @type {Context} */ ctx) {
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
      FIL_WALLET_ADDRESS: filAddress,
      ROOT_DIR: path.join(consts.CACHE_HOME, 'saturn')
    }
  })

  /** @type {Promise<void>} */
  const readyPromise = new Promise(function startSaturnNodeChildProcess (resolve, reject) {
    assert(childProcess, 'Unexpected error: child process is undefined after startup')

    const { stdout, stderr } = childProcess
    assert(stderr, 'stderr was not defined on child process')
    assert(stdout, 'stderr was not defined on child process')

    stdout.setEncoding('utf-8')
    stdout.on('data', (/** @type {string} */ data) => {
      forwardChunkFromSaturn(data, console.log)
      appendToChildLog(data)
      handleActivityLogs(ctx, data)
    })

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

      const apiMatch = output.match(/^API: (http.*)$/m)
      if (apiMatch) {
        apiUrl = apiMatch[1]

        appendToChildLog('Saturn node is up and ready')
        console.log('Saturn node is up and ready (API URL: %s)', apiUrl)
        webUrl = `${apiUrl}webui`
        ready = true
        stdout.off('data', readyHandler)

        ctx.recordActivity({ source: 'Saturn', type: 'info', message: 'Saturn module started.' })
        pollStatsInterval = setInterval(() => {
          pollStats(ctx)
            .catch(err => console.warn('Cannot fetch Saturn module stats.', err))
        }, 100)
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
    ctx.recordActivity({ source: 'Saturn', type: 'info', message: msg })

    ready = false
  })

  try {
    await Promise.race([
      readyPromise,
      setTimeout(500)
    ])
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '' + err
    const message = `Cannot start Saturn node: ${errorMsg}`
    appendToChildLog(message)
    console.error('Cannot start Saturn node:', err)
    ctx.recordActivity({ source: 'Saturn', type: 'error', message })
  }
}

function stop () {
  console.log('Stopping Saturn node')
  if (!childProcess) {
    console.log('Saturn node was not running')
    return
  }

  clearInterval(pollStatsInterval)

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

/**
 * @param {Context} ctx
 * @param {string} text
 */
function handleActivityLogs (ctx, text) {
  text
    .trimEnd()
    .split(/\n/g)
    .forEach(line => {
      const m = line.match(/^(INFO|ERROR): (.*)$/)
      if (!m) return

      ctx.recordActivity({
        source: 'Saturn',
        type: /** @type {any} */(m[1].toLowerCase()),
        message: m[2]
      })
    })
}

async function pollStats (/** @type {Context} */ ctx) {
  const res = await fetch(apiUrl + 'stats')
  if (!res.ok) {
    const msg = `Cannot fetch Saturn node stats: ${res.status}\n${await res.text().catch(noop)}`
    throw new Error(msg)
  }

  /** @type {any} */
  const stats = await res.json()

  const jobsCompleted = stats?.NSuccessfulRetrievals
  if (typeof jobsCompleted !== 'number') {
    const msg = 'Unexpected stats response - NSuccessfulRetrievals is not a number. Stats: ' + JSON.stringify(stats)
    throw new Error(msg)
  }
  ctx.setModuleJobsCompleted('saturn', jobsCompleted)
}

function noop () {
  // no-op
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
