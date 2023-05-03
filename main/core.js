'use strict'

const { app, BrowserWindow, dialog } = require('electron')
const { join, dirname } = require('node:path')
const execa = require('execa')
const wallet = require('./wallet')
const assert = require('node:assert')
const fs = require('node:fs/promises')
const Sentry = require('@sentry/node')
const consts = require('./consts')
const timers = require('node:timers/promises')

/** @typedef {import('./typings').Context} Context */
/** @typedef {import('@filecoin-station/core').ActivityEvent} ActivityEvent */

const corePath = join(
  __dirname,
  '..',
  'node_modules',
  '@filecoin-station',
  'core',
  'bin',
  'station.js'
)
console.log('Core binary: %s', corePath)

let online = false
/** @type {import('@filecoin-station/core').Core} */
let core

async function setup (/** @type {Context} */ ctx) {
  const { Core } = await import('@filecoin-station/core')
  core = new Core({
    cacheRoot: consts.CACHE_ROOT,
    stateRoot: consts.STATE_ROOT
  })

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
  subscribeWithRetry(ctx).catch(console.error)
  await start()
}

async function subscribeWithRetry (/** @type {Context} */ ctx) {
  while (true) {
    const controller = new AbortController()
    try {
      await subscribe(ctx, controller.signal)
    } catch (err) {
      controller.abort()
      console.error(err)
      await timers.setTimeout(1000)
    }
  }
}

async function subscribe (
  /** @type {Context} */ ctx,
  /** @type {AbortSignal} */ signal
) {
  await Promise.all([
    (async () => {
      for await (const metrics of core.metrics.follow(undefined, { signal })) {
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
 * @param {ActivityEvent} activity
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

async function start () {
  assert(wallet.getAddress(), 'Core requires FIL address')
  console.log('Starting Core...')

  const childProcess = execa(corePath, {
    env: {
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
  getActivity: () => core.activity.get(),
  getMetrics: () => core.metrics.getLatest(),
  setup,
  start,
  isOnline,
  getActivityFilePath: () => core.paths.activity
}
