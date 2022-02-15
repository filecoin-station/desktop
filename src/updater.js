const { BrowserWindow, app, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const log = require('electron-log').scope('updater')

function setup (ctx) {
  autoUpdater.autoDownload = false // we download manually in 'update-available'

  autoUpdater.on('error', err => log.error('error', err))
  autoUpdater.on('update-available', async ({ version, releaseNotes }) => {
    try {
      log.info('update-available, downloading..')
      await autoUpdater.downloadUpdate()
      log.info('update-available, downloaded')
    } catch (err) {
      log.error('update-available error', err)
    }
  })
  autoUpdater.on('update-not-available', ({ version }) => {
    log.info('update not available')
  })
  autoUpdater.on('update-downloaded', ({ version }) => {
    log.info(`update to ${version} downloaded`)
    const opt = dialog.showMessageBoxSync({
      title: 'Update downloaded',
      message: `Update to Filecoin Station ${version} is ready. When do you want to install it?`,
      type: 'info',
      buttons: ['Later', 'Install now']
    })
    if (opt === 1) { // Force install on restart
      setImmediate(async () => {
        await beforeQuitCleanup()
        autoUpdater.quitAndInstall()
      })
    }
  })
  const beforeQuitCleanup = async () => {
    BrowserWindow.getAllWindows().forEach(w => w.removeAllListeners('close'))
    app.removeAllListeners('window-all-closed')
  }
  // built-in updater != electron-updater
  // https://github.com/electron-userland/electron-builder/pull/6395
  require('electron').autoUpdater.on('before-quit-for-update', beforeQuitCleanup)
}

module.exports = async function (ctx) {
  if (process.env.NODE_ENV === 'development') {
    // skip init in dev if we are not debugging updater
    if (!fs.existsSync('dev-app-update.yml')) return
  }

  setup(ctx)
  // TODO: replace this with autoUpdater.checkForUpdatesAndNotify()
  const checkForUpdates = async () => await autoUpdater.checkForUpdates()
  checkForUpdates() // async check on startup
  setInterval(checkForUpdates, 43200000) // every 12 hours
}
