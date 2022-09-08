'use strict'

const { BrowserWindow, app, Notification, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const { ipcMain } = require('electron/main')
const ms = require('ms')
const log = require('electron-log').scope('updater')

const { showDialogSync } = require('./dialog')
const { ipcMainEvents } = require('./ipc')

// must be global to avoid gc
let updateNotification = null

let checkingManually = false

function beforeQuitCleanup () {
  BrowserWindow.getAllWindows().forEach(w => w.removeAllListeners('close'))
  app.removeAllListeners('window-all-closed')
}

function setup (/** @type {import('./typings').Context} */ _ctx) {
  autoUpdater.autoDownload = false // we download manually in 'update-available'

  autoUpdater.on('error', onUpdaterError)
  autoUpdater.on('update-available', onUpdateAvailable)
  autoUpdater.on('update-not-available', onUpdateNotAvailable)
  autoUpdater.on('update-downloaded', onUpdateDownloaded)

  // built-in updater != electron-updater
  // https://github.com/electron-userland/electron-builder/pull/6395
  require('electron').autoUpdater.on('before-quit-for-update', beforeQuitCleanup)
}

module.exports = async function (/** @type {import('./typings').Context} */ ctx) {
  if (['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
    ctx.manualCheckForUpdates = () => {
      showDialogSync({
        title: 'Not available in development',
        message: 'Yes, you called this function successfully.',
        type: 'info',
        buttons: ['Close']
      })
    }
    return
  }

  setup(ctx)

  checkForUpdatesInBackground() // async check on startup
  setInterval(checkForUpdatesInBackground, ms('12h'))

  // enable on-demand check via Tray menu
  ctx.manualCheckForUpdates = () => {
    checkingManually = true
    checkForUpdatesInBackground()
  }
}

function checkForUpdatesInBackground () {
  ipcMain.emit(ipcMainEvents.UPDATE_CHECK_STARTED)

  // TODO: replace this with autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.checkForUpdates()
    // We are ignoring errors, they are already handled by our `error` event listener
    .finally(() => ipcMain.emit(ipcMainEvents.UPDATE_CHECK_FINISHED))
}

/**
 * @param {any} err
 */
function onUpdaterError (err) {
  log.error('error', err)

  if (!checkingManually) { return }
  checkingManually = false

  showDialogSync({
    title: 'Could not download update',
    message: 'It was not possible to download the update. Please check your Internet connection and try again.',
    type: 'error',
    buttons: ['Close']
  })
}

/**
 * @param {import('electron-updater').UpdateInfo} info
 */
function onUpdateAvailable ({ version /*, releaseNotes */ }) {
  log.info(`Update to version ${version} is available, downloading..`)
  autoUpdater.downloadUpdate().then(
    _ => log.info('Update downloaded'),
    err => log.error('Cannot download the update.', err)
  )

  if (!checkingManually) { return }
  // do not toggle checkingManually off here so we can show a dialog once the download
  // is finished.

  const buttonIx = showDialogSync({
    title: 'Update available',
    message: `A new version ${version} of Filecoin Station is available. The download will begin shortly in the background.`,
    type: 'info',
    buttons: ['Close', 'Show Release Notes']
  })

  if (buttonIx === 1) {
    shell.openExternal(`https://github.com/filecoin-project/filecoin-station/releases/v${version}`)
  }
}

/**
 * @param {import('electron-updater').UpdateInfo} info
 */
function onUpdateNotAvailable ({ version }) {
  log.info(`update not available from version ${version}`)

  if (!checkingManually) { return }
  checkingManually = false

  showDialogSync({
    title: 'Update not available',
    message: `You are on the latest version of Filecoin Station (${version}).`,
    type: 'info',
    buttons: ['Close']
  })
}

/**
 * @param {import('electron-updater').UpdateDownloadedEvent} event
 */
function onUpdateDownloaded ({ version /*, releaseNotes */ }) {
  log.info(`update to ${version} downloaded`)

  const showUpdateDialog = () => {
    const buttonIx = showDialogSync({
      title: 'Update Filecoin Station',
      message: `An update to Filecoin Station ${version} is available. Would you like to install it now?`,
      type: 'info',
      buttons: ['Later', 'Install now']
    })
    if (buttonIx === 1) { // install now
      setImmediate(async () => {
        beforeQuitCleanup()
        autoUpdater.quitAndInstall()
      })
    }
  }

  if (checkingManually) {
    // when checking manually, show the dialog immediately
    showUpdateDialog()
  } else {
    // show unobtrusive notification + dialog on click
    updateNotification = new Notification({
      title: 'Filecoin Station Update',
      body: `An update to Filecoin Station ${version} is available.`
    })
    updateNotification.on('click', showUpdateDialog)
    updateNotification.show()
  }
}
