const { BrowserWindow, app, screen } = require('electron')
const store = require('./store')

/**
 * @param {import('./typings').Context} ctx
 * @returns {Promise<BrowserWindow>}
 */
module.exports = async function (ctx) {
  // Show docks only when UI is visible
  if (app.dock) app.dock.hide()

  const dimensions = screen.getPrimaryDisplay().size
  const ui = new BrowserWindow({
    title: 'Filecoin Station',
    show: false, // we show it via ready-to-show
    width: store.get('ui.width', dimensions.width < 1440 ? dimensions.width : 1440),
    height: store.get('ui.height', dimensions.height < 900 ? dimensions.height : 900),
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset'
  })

  // PoC for BrowserWindow with HTML UI
  ui.loadURL('https://filecoin.io/')

  // UX trick to avoid jittery UI while browser initializes chrome
  ctx.showUI = () => {
    if (app.dock) app.dock.show()
    return ui.show()
  }
  ui.once('ready-to-show', ctx.showUI)

  // Don't exit when window is closed (Quit only via Tray icon menu)
  ui.on('close', (event) => {
    event.preventDefault()
    ui.hide()
    if (app.dock) app.dock.hide()
  })

  // When true quit is triggered we need to remove listeners
  // that were added to keep app running when the UI is closed.
  // (Without this, the app would run forever and/or fail to update)
  app.on('before-quit', () => ui.removeAllListeners('close'))

  return ui
}
