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

const corePath = join(
  __dirname,
  '..',
  'node_modules',
  '@filecoin-station',
  'core',
  'bin',
  'station.js'
)
console.log('Using Core binary: %s', corePath)

let online = false
let isRunning = false

async function setup (/** @type {Context} */ ctx) {
  ctx.saveSaturnModuleLogAs = async () => {
    const opts = { defaultPath: 'saturn.txt' }
    const win = BrowserWindow.getFocusedWindow()
    const { filePath } = win
      ? await dialog.showSaveDialog(win, opts)
      : await dialog.showSaveDialog(opts)
    if (filePath) {
      await fs.writeFile(
        filePath,
        (await execa(corePath, ['logs', 'saturn-l2-node'])).stdout
      )
    }
  }
  await start(ctx)
}

const startEventsProcess = (/** @type {Context} */ ctx) => {
  // TODO: Restart on failure
  const eventsChildProcess = execa(corePath, ['events'])
  assert(eventsChildProcess.stdout, 'Events child process has no stdout')
  eventsChildProcess.stdout
    .pipe(JSONStream.parse(true))
    .on('data', (/** @type {CoreEvent} */ event) => {
      switch (event.type) {
        case 'jobs-completed': {
          ctx.setModuleJobsCompleted('saturn', event.total)
          break
        }
        case 'activity:info': {
          ctx.recordActivity({
            source: 'Saturn',
            type: 'info',
            message: event.message
          })
          if (event.message.includes('Saturn Node is online')) {
            online = true
          }
          break
        }
        case 'activity:error': {
          ctx.recordActivity({
            source: 'Saturn',
            type: 'error',
            message: event.message
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
    eventsChildProcess.kill()
  })
}

async function start (/** @type {Context} */ ctx) {
  assert(wallet.getAddress(), 'Core requires FIL address')
  console.log('Starting Core...')

  if (isRunning) {
    console.log('Core is already running.')
    return
  }
  isRunning = true

  startEventsProcess(ctx)

  const coreChildProcess = execa(corePath, [], {
    env: {
      FIL_WALLET_ADDRESS: wallet.getAddress()
    }
  })

  app.on('before-quit', () => {
    coreChildProcess.kill()
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
    const msg = `Saturn node exited ${reason}`
    console.log(msg)
    coreExitReason = signal || code ? reason : null
  })
}

function isOnline () {
  return online
}

async function getLog () {
  const { stdout: log } = await execa(
    corePath,
    ['logs'],
    { encoding: 'utf8' }
  )
  return log
}

module.exports = {
  getLog,
  setup,
  start,
  isOnline
}
