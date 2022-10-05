'use strict'

require('./setup-sentry')

const { app, dialog } = require('electron')
const { ipcMainEvents, setupIpcMain } = require('./ipc')
const { ActivityLog } = require('./activity-log')
const { BUILD_VERSION } = require('./consts')
const { JobStats } = require('./job-stats')
const { ipcMain } = require('electron/main')
const log = require('electron-log')
const path = require('node:path')
const saturnNode = require('./saturn-node')
const serve = require('electron-serve')
const { setupAppMenu } = require('./app-menu')
const setupTray = require('./tray')
const setupUI = require('./ui')
const setupUpdater = require('./updater')
const Sentry = require('@sentry/node')
const { setup: setupDialogs } = require('./dialog')

/** @typedef {import('./typings').Activity} Activity */
/** @typedef {import('./typings').RecordActivityArgs} RecordActivityOptions */

const inTest = (process.env.NODE_ENV === 'test')
const isDev = !app.isPackaged && !inTest

console.log('Filecoin Station build version:', BUILD_VERSION)

// Expose additional metadata for Electron preload script
process.env.STATION_BUILD_VERSION = BUILD_VERSION

function handleError (/** @type {any} */ err) {
  Sentry.captureException(err)

  ctx.recordActivity({
    source: 'Station',
    type: 'error',
    message: `Station failed to start: ${err.message || err}`
  })

  log.error(err)
  dialog.showErrorBox('Error occured', err.stack ?? err.message ?? err)
}

// ensures there are no unhandled errors during initial dev
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

// Sets User Model Id so notifications work on Windows 10
// To show notifications properly on Windows, we must manually set the appUserModelID
// See https://www.electronjs.org/docs/tutorial/notifications#windows
if (process.platform === 'win32') {
  app.setAppUserModelId('io.filecoin.station')
}

// Only one instance can run at a time
if (!app.requestSingleInstanceLock() && !inTest) {
  app.quit()
}

const jobStats = new JobStats()

const activityLog = new ActivityLog()
if (isDev) {
  // Do not preserve old Activity entries in development mode
  activityLog.reset()
}

/** @type {import('./typings').Context} */
const ctx = {
  getAllActivities: () => activityLog.getAllEntries(),

  recordActivity: (args) => {
    activityLog.record(args)
    ipcMain.emit(ipcMainEvents.ACTIVITY_LOGGED, activityLog.getAllEntries())
  },

  getTotalJobsCompleted: () => jobStats.getTotalJobsCompleted(),
  setModuleJobsCompleted: (moduleName, count) => {
    jobStats.setModuleJobsCompleted(moduleName, count)
    ipcMain.emit(ipcMainEvents.JOB_STATS_UPDATED, jobStats.getTotalJobsCompleted())
  },

  manualCheckForUpdates: () => { throw new Error('never get here') },
  saveSaturnModuleLogAs: () => { throw new Error('never get here') },
  showUI: () => { throw new Error('never get here') },
  loadWebUIFromDist: serve({ directory: path.resolve(__dirname, '../renderer/dist') }),
  confirmChangeWalletAddress: () => { throw new Error('never get here') }
}

app.on('before-quit', () => {
  // Flush pending events immediately
  // See https://docs.sentry.io/platforms/node/configuration/draining/
  Sentry.close()
})

process.on('uncaughtException', err => {
  Sentry.captureException(err)
  log.error(err)
  process.exitCode = 1
})

process.on('exit', () => {
  ctx.recordActivity({ source: 'Station', type: 'info', message: 'Station stopped.' })
})

async function run () {
  try {
    await app.whenReady()
  } catch (e) {
    handleError(e)
    app.exit(1)
  }

  try {
    // Interface
    await setupTray(ctx)
    if (process.platform === 'darwin') {
      await setupAppMenu(ctx)
    }
    await setupUI(ctx)
    await setupUpdater(ctx)
    await setupIpcMain(ctx)

    ctx.recordActivity({ source: 'Station', type: 'info', message: 'Station started.' })

    await saturnNode.setup(ctx)
    setupDialogs(ctx)
  } catch (e) {
    handleError(e)
  }
}

run()
