'use strict'

const { app, BrowserWindow, dialog } = require('electron')
const { join } = require('node:path')
const execa = require('execa')
const wallet = require('./wallet')
const assert = require('node:assert')
const fs = require('node:fs/promises')
const JSONStream = require('jsonstream')
const Sentry = require('@sentry/node')

/** @typedef {import('./typings').Context} Context */
/** @typedef {import('./typings').CoreEvent} CoreEvent */
/** @typedef {import('./typings').Activity} Activity */

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
      await fs.writeFile(
        filePath,
        (await execa(corePath, ['logs'])).stdout
      )
    }
  }
  await start(ctx)
}

async function start (/** @type {Context} */ ctx) {
  assert(wallet.getAddress(), 'Core requires FIL address')
  console.log('Starting Core...')

  startEventsProcess(ctx)

  const coreChildProcess = execa(corePath, [], {
    env: {
      FIL_WALLET_ADDRESS: wallet.getAddress()
    }
  })

  /** @type {string | null} */
  let coreExitReason = null

  coreChildProcess.on('close', code => {
    console.log(`Core closed all stdio with code ${code ?? '<no code>'}`)

    ;(async () => {
      const log = await getLog()
      Sentry.captureException('Core exited', scope => {
        // Sentry UI can't show the full 100 lines
        scope.setExtra('logs', log.split('\n').slice(-10).join('\n'))
        scope.setExtra('reason', coreExitReason)
        return scope
      })
    })()
  })

  coreChildProcess.on('exit', (code, signal) => {
    const reason = signal ? `via signal ${signal}` : `with code: ${code}`
    const msg = `Core exited ${reason}`
    console.log(msg)
    coreExitReason = signal || code ? reason : null
  })
}

function startEventsProcess (/** @type {Context} */ ctx) {
  console.log('Starting Core Events...')
  const events = execa(corePath, ['events'])
  assert(events.stdout, 'Events child process has no stdout')
  events.stdout
    .pipe(JSONStream.parse(true))
    .on('data', (/** @type {CoreEvent} */ event) => {
      switch (event.type) {
        case 'jobs-completed': {
          ctx.setTotalJobsCompleted(event.total)
          break
        }
        case 'activity:info': {
          ctx.recordActivity({
            source: event.module,
            type: 'info',
            message: event.message,
            date: new Date(event.date).getTime()
          })
          if (event.message.includes('Saturn Node is online')) {
            online = true
          }
          break
        }
        case 'activity:error': {
          ctx.recordActivity({
            source: event.module,
            type: 'error',
            message: event.message,
            date: new Date(event.date).getTime()
          })
          if (
            event.message === 'Saturn Node started.' ||
            event.message.includes('was able to connect') ||
            event.message.includes('will try to connect')
          ) {
            online = false
          }
        }
      }
    })
  app.on('before-quit', () => {
    events.kill()
  })
  events.on('exit', (code, signal) => {
    if (code !== 0) {
      console.log(`Events process exited with code=${code} signal=${signal}`)
      setTimeout(() => startEventsProcess(ctx), 1000)
    }
  })
}

function isOnline () {
  return online
}

/**
 * @returns {Promise<Activity[]>}
 */
async function getActivity () {
  const { stdout: activity } = await execa(
    corePath,
    ['activity', '--json']
  )
  return JSON.parse(activity)
}

async function getLog () {
  const { stdout: log } = await execa(
    corePath,
    ['logs'],
    { encoding: 'utf8' }
  )
  return log
}

async function getMetrics () {
  const { stdout: json } = await execa(
    corePath,
    ['metrics']
  )
  return JSON.parse(json)
}

module.exports = {
  getActivity,
  getLog,
  getMetrics,
  setup,
  start,
  isOnline
}
