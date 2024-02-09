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
  await maybeMigrateFiles()
  await start(ctx)
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
      CACHE_ROOT: consts.CACHE_ROOT,
      STATE_ROOT: consts.STATE_ROOT,
      DEPLOYMENT_TYPE: 'station-desktop'
    },
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  })

  assert(childProcess.stdout)
  childProcess.stdout.setEncoding('utf8')
  childProcess.stdout
    .pipe(split2())
    .on('data', line => {
      logs.push(line)
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
        case 'activity:error': {
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
    .on('data', line => logs.push(line))

  /** @type {string | null} */
  let exitReason = null

  app.on('before-quit', () => {
    childProcess.kill()
  })

  childProcess.on('close', code => {
    console.log(`Core closed all stdio with code ${code ?? '<no code>'}`)

    Sentry.captureException('Core exited', scope => {
      // Sentry UI can't show the full 100 lines
      scope.setExtra('logs', logs.getLast(10))
      scope.setExtra('reason', exitReason)
      return scope
    })
  })

  childProcess.on('exit', (code, signal) => {
    const reason = signal ? `via signal ${signal}` : `with code: ${code}`
    const msg = `Core exited ${reason}`
    console.log(msg)
    exitReason = signal || code ? reason : null
  })
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
  isOnline: () => activities.isOnline(),
  getActivities: () => activities.get(),
  getTotalJobsCompleted: () => totalJobsCompleted
}
