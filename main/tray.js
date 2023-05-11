'use strict'

const { IS_MAC, STATION_VERSION } = require('./consts')
const { Menu, Tray, app, ipcMain, nativeImage } = require('electron')
const { ipcMainEvents } = require('./ipc')
const path = require('path')
const assert = require('node:assert')
const core = require('./core')

/** @typedef {import('./typings').Context} Context */

// Be warned, this one is pretty ridiculous:
// Tray must be global or it will break due to.. GC.
// https://www.electronjs.org/docs/faq#my-apps-tray-disappeared-after-a-few-minutes
/** @type {Tray | null} */
let tray = null

const icons = {
  on: icon('on'),
  off: icon('off'),
  updateOn: icon('update'),
  updateOff: icon('update-off')
}

function icon (/** @type {'on' | 'off' | 'update' | 'update-off'} */ state) {
  const dir = path.resolve(path.join(__dirname, '../assets/tray'))
  const file = IS_MAC ? `${state}-macos.png` : `${state}.png`
  const image = nativeImage.createFromPath(path.join(dir, file))
  image.setTemplateImage(true)
  return image
}

/**
 * @param {boolean} isUpdateAvailable
 * @param {boolean} isOnline
 */
function getTrayIcon (isUpdateAvailable, isOnline) {
  return isUpdateAvailable
    ? isOnline
      ? icons.updateOn
      : icons.updateOff
    : isOnline
      ? icons.on
      : icons.off
}

module.exports = function (/** @type {Context} */ ctx) {
  tray = new Tray(getTrayIcon(false, core.isOnline()))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Filecoin Station v${STATION_VERSION}`,
      enabled: false
    },
    {
      label: 'Open Station',
      click: () => ctx.showUI()
    },
    { type: 'separator' },
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
      label: 'Save Module Logs As…',
      click: function () {
        ctx.saveModuleLogsAs()
      }
    },
    { type: 'separator' },
    {
      label: 'Start at login',
      type: 'checkbox',
      click: function (item) {
        const openAtLogin = !app.getLoginItemSettings().openAtLogin
        app.setLoginItemSettings({ openAtLogin })
        item.checked = openAtLogin
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

  setupIpcEventListeners(contextMenu, ctx)
}

/**
 * @param {Electron.Menu} contextMenu
 * @param {Context} ctx
 */
function setupIpcEventListeners (contextMenu, ctx) {
  ipcMain.on(ipcMainEvents.UPDATE_CHECK_STARTED, () => {
    getItemById('checkForUpdates').visible = false
    getItemById('checkingForUpdates').visible = true
  })

  ipcMain.on(ipcMainEvents.UPDATE_CHECK_FINISHED, () => {
    getItemById('checkForUpdates').visible = true
    getItemById('checkingForUpdates').visible = false
  })

  ipcMain.on(ipcMainEvents.ACTIVITY_LOGGED, updateTray)
  ipcMain.on(ipcMainEvents.UPDATE_AVAILABLE, updateTray)

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

  function updateTray () {
    assert(tray)
    tray.setImage(
      getTrayIcon(ctx.getUpdaterStatus().updateAvailable, core.isOnline())
    )
  }
}
