'use strict'

const { app, dialog } = require('electron')
const { join, dirname } = require('node:path')
const { fork } = require('node:child_process')
const wallet = require('./wallet')
const assert = require('node:assert')
const fs = require('node:fs/promises')
const Sentry = require('@sentry/node')
const consts = require('./consts')
const { randomUUID } = require('node:crypto')
const { Activities } = require('./activities')
const { Logs } = require('./logs')
const split2 = require('split2')
const { parseEther } = require('ethers/lib/utils')
const { once } = require('node:events')

/** @typedef {import('./typings').Context} Context */

// Core is installed separately from `node_modules`, since it needs a
// self-contained dependency tree outside the asar archive.
const corePath = app.isPackaged
  ? join(process.resourcesPath, 'core', 'bin', 'station.js')
  : join(__dirname, '..', 'core', 'bin', 'station.js')
console.log('Core binary: %s', corePath)

const logs = new Logs()
const activities = new Activities()
let totalJobsCompleted = 0

/**
 * @param {Context} ctx
 */
async function setup (ctx) {
  ctx.saveModuleLogsAs = async () => {
    const opts = {
      defaultPath: `station-modules-${(new Date()).getTime()}.log`
    }
    // The dialog might not show if the UI is hidden
    ctx.showUI()
    const { filePath } = await dialog.showSaveDialog(opts)
    if (filePath) {
      await fs.writeFile(filePath, logs.get())
    }
  }
}

/**
 * @param {Context} ctx
 */
async function run (ctx) {
  while (true) {
    await start(ctx)
  }
}

let lastCrashReportedAt = 0
/**
 * @param {unknown} err
 * @param {any} scopeFn
 */
function maybeReportErrorToSentry (err, scopeFn) {
  const now = Date.now()
  if (now - lastCrashReportedAt < 4 /* HOURS */ * 3600_000) return
  lastCrashReportedAt = now
  console.error(
    'Reporting the problem to Sentry for inspection by the Station team.'
  )
  Sentry.captureException(err, scopeFn)
}

/**
 * @param {Context} ctx
 */
async function start (ctx) {
  console.log('Starting Core...')

  const childProcess = fork(corePath, ['--json'], {
    env: {
      ...process.env,
      FIL_WALLET_ADDRESS: await wallet.getAddress(),
      PASSPHRASE: await wallet.signMessage('station core passhprase'),
      CACHE_ROOT: consts.CACHE_ROOT,
      STATE_ROOT: consts.STATE_ROOT,
      DEPLOYMENT_TYPE: 'station-desktop'
    },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  })
  console.log('Core pid', childProcess.pid)

  assert(childProcess.stdout)
  childProcess.stdout.setEncoding('utf8')
  childProcess.stdout
    .pipe(split2())
    .on('data', line => {
      logs.pushLine(line)
      let event
      try {
        event = JSON.parse(line)
      } catch (_err) {
        const err = new Error(`Failed to parse core event: ${line}`)
        err.cause = _err
        if (!line.includes('failed to detect network')) {
          Sentry.captureException(err)
        }
        console.error(err)
        return
      }
      switch (event.type) {
        case 'jobs-completed':
          totalJobsCompleted = event.total
          ctx.setTotalJobsCompleted(event.total)
          wallet.setScheduledRewards(
            parseEther(event.rewardsScheduledForAddress)
          )
          ctx.setScheduledRewardsForAddress(event.rewardsScheduledForAddress)
          break
        case 'activity:info':
        case 'activity:error':
        case 'activity:started': {
          const activity = {
            ...event,
            type: event.type.replace('activity:', ''),
            timestamp: new Date(),
            id: randomUUID()
          }
          activities.push(ctx, activity)
          break
        }
        default: {
          const err = new Error(
            `Unknown Station Core event type "${event.type}": ${line}`
          )
          console.error(err)
          Sentry.captureException(err)
        }
      }
    })

  assert(childProcess.stderr)
  childProcess.stderr.setEncoding('utf8')
  childProcess.stderr
    .pipe(split2())
    .on('data', line => logs.pushLine(line))

  const onBeforeQuit = () => childProcess.kill()
  app.on('before-quit', onBeforeQuit)

  const onceExited = once(childProcess, 'exit')
  const onceClosed = once(childProcess, 'close')

  const [exitCode, exitSignal] = await onceExited
  app.removeListener('before-quit', onBeforeQuit)
  const reason = exitSignal
    ? `via signal ${exitSignal}`
    : `with code: ${exitCode}`
  const msg = `Core exited ${reason}`
  console.log(msg)
  const exitReason = exitSignal || exitCode ? reason : null

  const [closeCode] = await onceClosed
  console.log(`Core closed all stdio with code ${closeCode ?? '<no code>'}`)

  if (closeCode === 2) {
    // FIL_WALLET_ADDRESS did not pass our screening. There is not much
    // we can do about that, there is no point in reporting this error
    // to Sentry.
    throw new Error('Invalid Filecoin wallet address')
  }

  maybeReportErrorToSentry('Core exited', (/** @type {any} */ scope) => {
    // Sentry UI can't show the full 100 lines
    scope.setExtra('logs', logs.getLastLines(20))
    scope.setExtra('reason', exitReason)
    return scope
  })
}

module.exports = {
  setup,
  run,
  isOnline: () => activities.isOnline(),
  getActivities: () => activities.get(),
  getTotalJobsCompleted: () => totalJobsCompleted
}
