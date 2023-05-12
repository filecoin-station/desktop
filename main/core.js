'use strict'

const { app, BrowserWindow, dialog } = require('electron')
const { join, dirname } = require('node:path')
const { fork } = require('node:child_process')
const wallet = require('./wallet')
const assert = require('node:assert')
const fs = require('node:fs/promises')
const Sentry = require('@sentry/node')
const consts = require('./consts')
const timers = require('node:timers/promises')
const { Core } = require('@filecoin-station/core')

/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').Activity} Activity */

// Core is installed separately from `node_modules`, since it needs its own
// independent dependency tree outside an asar archive.
const corePath = app.isPackaged
  ? join(process.resourcesPath, 'core', 'bin', 'station.js')
  : join(__dirname, '..', 'core', 'bin', 'station.js')
console.log('Core binary: %s', corePath)

let online = false

const corePromise = Core.create({
  cacheRoot: consts.CACHE_ROOT,
  stateRoot: consts.STATE_ROOT
})

async function setup (/** @type {Context} */ ctx) {
  const core = await corePromise
  ctx.saveModuleLogsAs = async () => {
    const opts = {
      defaultPath: `station-modules-${(new Date()).getTime()}.log`
    }
    const win = BrowserWindow.getFocusedWindow()
    const { filePath } = win
      ? await dialog.showSaveDialog(win, opts)
      : await dialog.showSaveDialog(opts)
    if (filePath) {
      await fs.writeFile(filePath, await core.logs.get())
    }
  }
  await maybeMigrateFiles()
  subscribeWithRetry(ctx, core).catch(console.error)
  await start(core)
}

async function subscribeWithRetry (
  /** @type {Context} */ ctx,
  /** @type {Core} */ core
) {
  while (true) {
    const controller = new AbortController()
    try {
      await subscribe(ctx, core, controller.signal)
    } catch (err) {
      controller.abort()
      console.error(err)
      await timers.setTimeout(1000)
    }
  }
}

async function subscribe (
  /** @type {Context} */ ctx,
  /** @type {Core} */ core,
  /** @type {AbortSignal} */ signal
) {
  await Promise.all([
    (async () => {
      for await (const metrics of core.metrics.follow({ signal })) {
        ctx.setTotalJobsCompleted(metrics.totalJobsCompleted)
      }
    })(),
    (async () => {
      const it = core.activity.follow({ nLines: 0, signal })
      for await (const activity of it) {
        ctx.recordActivity(activity)
        detectChangeInOnlineStatus(activity)
      }
    })()
  ])
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
 * @param {Core} core
 */
async function start (core) {
  assert(wallet.getAddress(), 'Core requires FIL address')
  console.log('Starting Core...')

  const childProcess = fork(corePath, {
    env: {
      ...process.env,
      FIL_WALLET_ADDRESS: wallet.getAddress(),
      CACHE_ROOT: consts.CACHE_ROOT,
      STATE_ROOT: consts.STATE_ROOT
    }
  })

  /** @type {string | null} */
  let exitReason = null

  app.on('before-quit', () => {
    childProcess.kill()
  })

  childProcess.on('close', code => {
    console.log(`Core closed all stdio with code ${code ?? '<no code>'}`)

    ;(async () => {
      const log = await core.logs.get()
      Sentry.captureException('Core exited', scope => {
        // Sentry UI can't show the full 100 lines
        scope.setExtra('logs', log.split('\n').slice(-10).join('\n'))
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
  getActivity: async () => {
    const core = await corePromise
    return core.activity.get()
  },
  getMetrics: async () => {
    const core = await corePromise
    return core.metrics.getLatest()
  },
  setup,
  start,
  isOnline,
  getActivityFilePath: async () => {
    const core = await corePromise
    return core.paths.activity
  }
}
