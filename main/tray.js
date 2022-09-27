'use strict'

const { IS_MAC, STATION_VERSION } = require('./consts')
const { Menu, Tray, app, ipcMain, shell } = require('electron')
const { ipcMainEvents } = require('./ipc')
const path = require('path')

// Be warned, this one is pretty ridiculous:
// Tray must be global or it will break due to.. GC.
// https://www.electronjs.org/docs/faq#my-apps-tray-disappeared-after-a-few-minutes
let tray = null

const on = 'on'
// const off = 'off'

function icon (/** @type {'on' | 'off'} */ state) {
  const dir = path.resolve(path.join(__dirname, '../assets/tray'))
  if (IS_MAC) return path.join(dir, `${state}-macos.png`)
  return path.join(dir, `${state}.png`)
}

module.exports = function (/** @type {import('./typings').Context} */ ctx) {
  tray = new Tray(icon(on))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Filecoin Station v${STATION_VERSION}`,
      click: () => { shell.openExternal(`https://github.com/filecoin-project/filecoin-station/releases/v${STATION_VERSION}`) }
    },
    {
      id: 'checkForUpdates',
      label: 'Check for Updates...',
      click: () => { ctx.manualCheckForUpdates() }
    },
    {
      id: 'checkingForUpdates',
      label: 'Checking for Updates',
      enabled: false,
      visible: false
    },
    {
      label: 'Save Saturn Module Log As…',
      click: function () {
        ctx.saveSaturnModuleLogAs()
      }
    },
    { type: 'separator' },
    {
      id: 'showUi',
      label: 'Show UI',
      click: () => ctx.showUI()
    },
    {
      label: 'Start at login',
      type: 'checkbox',
      click: function () {
        const openAtLogin = !app.getLoginItemSettings().openAtLogin
        app.setLoginItemSettings({ openAtLogin })
        this.checked = openAtLogin
      },
      checked: app.getLoginItemSettings().openAtLogin
    },
    { type: 'separator' },
    {
      label: 'Quit Station',
      click: () => app.quit(),
      accelerator: IS_MAC ? 'Command+Q' : undefined
    }
  ])
  tray.setToolTip('Filecoin Station')
  tray.setContextMenu(contextMenu)

  setupIpcEventListeners(contextMenu)
}

/**
 * @param {Electron.Menu} contextMenu
 */
function setupIpcEventListeners (contextMenu) {
  ipcMain.on(ipcMainEvents.UPDATE_CHECK_STARTED, () => {
    getItemById('checkForUpdates').visible = false
    getItemById('checkingForUpdates').visible = true
  })

  ipcMain.on(ipcMainEvents.UPDATE_CHECK_FINISHED, () => {
    getItemById('checkForUpdates').visible = true
    getItemById('checkingForUpdates').visible = false
  })

  /**
   * Get an item from the Tray menu or fail with a useful error message.
   * @param {string} id
   * @returns {Electron.MenuItem}
   */
  function getItemById (id) {
    const item = contextMenu.getMenuItemById(id)
    if (!item) throw new Error(`Unknown tray menu item id: ${id}`)
    return item
  }
}
