'use strict'

const { app, BrowserWindow, dialog } = require('electron')
const { join, dirname } = require('node:path')
const { fork } = require('node:child_process')
const wallet = require('./wallet')
const assert = require('node:assert')
const fs = require('node:fs/promises')
const Sentry = require('@sentry/node')
const consts = require('./consts')
const { randomUUID } = require('node:crypto')

/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').Activity} Activity */

// Core is installed separately from `node_modules`, since it needs a
// self-contained dependency tree outside the asar archive.
const corePath = app.isPackaged
  ? join(process.resourcesPath, 'core', 'bin', 'station.js')
  : join(__dirname, '..', 'core', 'bin', 'station.js')
console.log('Core binary: %s', corePath)

let online = false

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
    return this.#logs.join('\n')
  }
}

const logs = new Logs()

async function setup (/** @type {Context} */ ctx) {
  ctx.saveModuleLogsAs = async () => {
    const opts = {
      defaultPath: `station-modules-${(new Date()).getTime()}.log`
    }
    const win = BrowserWindow.getFocusedWindow()
    const { filePath } = win
      ? await dialog.showSaveDialog(win, opts)
      : await dialog.showSaveDialog(opts)
    if (filePath) {
      await fs.writeFile(filePath, logs.get())
    }
  }
  await maybeMigrateFiles()
  await start(ctx)
}

/**
 * @param {Activity} activity
 */
function detectChangeInOnlineStatus (activity) {
  if (
    activity.type === 'info' &&
    activity.message.includes('Saturn Node is online')
  ) {
    online = true
  } else if (
    activity.message === 'Saturn Node started.' ||
    activity.message.includes('was able to connect') ||
    activity.message.includes('will try to connect')
  ) {
    online = false
  }
}

/**
 * @param {Context} ctx
 */
async function start (ctx) {
  assert(wallet.getAddress(), 'Core requires FIL address')
  console.log('Starting Core...')

  const childProcess = fork(corePath, ['--json'], {
    env: {
      ...process.env,
      FIL_WALLET_ADDRESS: wallet.getAddress(),
      CACHE_ROOT: consts.CACHE_ROOT,
      STATE_ROOT: consts.STATE_ROOT,
      DEPLOYMENT_TYPE: 'station-desktop'
    },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  })

  assert(childProcess.stdout)
  childProcess.stdout.setEncoding('utf8')
  childProcess.stdout.on('data', chunk => {
    logs.push(chunk)
    for (const line of chunk.split('\n').filter(Boolean)) {
      const event = JSON.parse(line)
      switch (event.type) {
        case 'jobs-completed':
          ctx.setTotalJobsCompleted(event.total)
          break
        case 'activity:info':
        case 'activity:error': {
          const activity = {
            ...event,
            timestamp: new Date(),
            id: randomUUID()
          }
          ctx.recordActivity(activity)
          detectChangeInOnlineStatus(activity)
          break
        }
        default:
          throw new Error(`Unknown event type: ${event.type}`)
      }
    }
  })

  assert(childProcess.stderr)
  childProcess.stderr.setEncoding('utf8')
  childProcess.stderr.on('data', chunk => logs.push(chunk))

  /** @type {string | null} */
  let exitReason = null

  app.on('before-quit', () => {
    childProcess.kill()
  })

  childProcess.on('close', code => {
    console.log(`Core closed all stdio with code ${code ?? '<no code>'}`)

    ;(async () => {
      Sentry.captureException('Core exited', scope => {
        // Sentry UI can't show the full 100 lines
        scope.setExtra('logs', logs.get())
        scope.setExtra('reason', exitReason)
        return scope
      })
    })()
  })

  childProcess.on('exit', (code, signal) => {
    const reason = signal ? `via signal ${signal}` : `with code: ${code}`
    const msg = `Core exited ${reason}`
    console.log(msg)
    exitReason = signal || code ? reason : null
  })
}

function isOnline () {
  return online
}

async function maybeMigrateFiles () {
  const oldSaturnDir = join(consts.LEGACY_CACHE_HOME, 'saturn')
  const newSaturnDir = join(consts.CACHE_ROOT, 'modules', 'saturn-l2-node')
  try {
    await fs.stat(newSaturnDir)
    return
  } catch {}
  try {
    await fs.stat(oldSaturnDir)
  } catch {
    return
  }
  console.log(
    'Migrating files from %s to %s',
    oldSaturnDir,
    newSaturnDir
  )
  await fs.mkdir(dirname(newSaturnDir), { recursive: true })
  await fs.rename(oldSaturnDir, newSaturnDir)
  console.log('Migration complete')
}

module.exports = {
  setup,
  isOnline
}
