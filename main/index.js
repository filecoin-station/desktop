'use strict'

const { app, dialog } = require('electron')
const log = require('electron-log')
const serve = require('electron-serve')
const path = require('node:path')

const setupUI = require('./ui')
const setupTray = require('./tray')
const setupUpdater = require('./updater')
const saturnNode = require('./saturn-node')
const { setupIpcMain, ipcMainEvents } = require('./ipc')
const { setupAppMenu } = require('./app-menu')

const { ActivityLog } = require('./activity-log')
const { ipcMain } = require('electron/main')

/** @typedef {import('./typings').ActivityEvent} ActivityEvent */
/** @typedef {import('./typings').RecordActivityOptions} RecordActivityOptions */

const inTest = (process.env.NODE_ENV === 'test')
const isDev = !app.isPackaged && !inTest

if (isDev) {
  // Do not preserve old Activity entries in development mode
  ActivityLog.reset()
}

function handleError (/** @type {any} */ err) {
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

/** @type {import('./typings').Context} */
const ctx = {
  resumeActivityStream,
  recordActivity,
  manualCheckForUpdates: () => { throw new Error('never get here') },
  showUI: () => { throw new Error('never get here') },
  loadWebUIFromDist: serve({ directory: path.resolve(__dirname, '../renderer/dist') })
}

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
    await setupAppMenu(ctx)
    await setupUI(ctx)
    await setupUpdater(ctx)
    await setupIpcMain(ctx)

    ctx.recordActivity({ source: 'Station', type: 'info', message: 'Station started.' })

    await saturnNode.setup(ctx)
  } catch (e) {
    handleError(e)
  }
}

const activityLog = new ActivityLog()
let isActivityStreamFlowing = false

/**
 * @param {RecordActivityOptions} event
 */
function recordActivity (event) {
  const entry = activityLog.recordEvent(event)
  if (isActivityStreamFlowing) emitActivity(entry)
}

/**
 * @param {ActivityEvent} entry
 */
function emitActivity (entry) {
  ipcMain.emit(ipcMainEvents.ACTIVITY_LOGGED, entry)
}

function resumeActivityStream () {
  isActivityStreamFlowing = true
  const existingEntries = activityLog.getAllEntries()
  for (const it of existingEntries) emitActivity(it)
}

run()
