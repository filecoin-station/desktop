const { app, dialog } = require('electron')
const log = require('electron-log')
const setupUI = require('./ui')
const setupTray = require('./tray')
const setupUpdater = require('./updater')

function handleError (err) {
  log.error(err)
  dialog.showErrorBox('Error occured', err.stack)
}
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

// Various fixups we had to add over the years
const weltschmerzFixups = () => {
  // Required for isolated E2E tests with playwright
  if (process.env.NODE_ENV === 'test') {
    const path = require('path')
    app.setPath('home', process.env.HOME)
    app.setPath('userData', path.join(process.env.HOME, 'data'))
  }

  // Sets User Model Id so notifications work on Windows 10
  // To show notifications properly on Windows, we must manually set the appUserModelID
  // See https://www.electronjs.org/docs/tutorial/notifications#windows
  if (process.platform === 'win32') {
    app.setAppUserModelId('io.filecoin.station')
  }
}
weltschmerzFixups()

// Only one instance can run at a time
if (!app.requestSingleInstanceLock()) {
  process.exit(0)
}

const ctx = {}

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
    await setupUI(ctx)
    await setupUpdater(ctx)
  } catch (e) {
    handleError(e)
  }
}

run()
