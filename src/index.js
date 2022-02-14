const { app, dialog } = require('electron')

// Provisional logger
const console = require('console')
app.console = new console.Console(process.stdout, process.stderr)
const logger = app.console
function handleError (err) {
  logger.error(err)
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

/* TODO: app init goes here
 * For now it only shows BrowserWindow with filecoin.io */
async function run () {
  try {
    await app.whenReady()
  } catch (e) {
    handleError(e)
    app.exit(1)
  }

  try {
    const { BrowserWindow } = require('electron')
    const win = new BrowserWindow({ show: false })
    win.loadURL('https://filecoin.io/')
    // UX trick to avoid jittery UI while browser initializes chrome
    win.once('ready-to-show', () => win.show())
  } catch (e) {
    handleError(e)
  }
}

run()
