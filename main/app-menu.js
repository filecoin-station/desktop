'use strict'

const { Menu, MenuItem, ipcMain, clipboard } = require('electron')
const { ipcMainEvents } = require('./ipc')
const { getSeedPhrase } = require('./wallet')

function setupAppMenu (/** @type {import('./typings').Context} */ ctx) {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  setupCheckForUpdatesMenuItem(ctx, menu)

  // File menu
  menu.items[1].submenu?.insert(0, new MenuItem({
    label: 'Save Module Logs As…',
    click: () => { ctx.saveModuleLogsAs() }
  }))
  menu.items[1].submenu?.insert(1, new MenuItem({
    label: 'Copy Wallet Seed Phrase To Clipboard',
    click: async () => {
      clipboard.writeText(await getSeedPhrase())
    }
  }))

  Menu.setApplicationMenu(menu)
  setupIpcEventListeners(menu)
}

/**
 * Add "Check for updates..." item to the Application menu on MacOS
 * @param {import('./typings').Context} ctx
 * @param {Electron.Menu} menu
 */
function setupCheckForUpdatesMenuItem (ctx, menu) {
  const checkForUpdates = new MenuItem({
    id: 'checkForUpdates',
    label: 'Check For Updates...',
    click: () => { ctx.manualCheckForUpdates() }
  })
  const checkingForUpdates = new MenuItem({
    id: 'checkingForUpdates',
    label: 'Checking For Updates',
    enabled: false,
    visible: false
  })

  // Filecoin Station menu
  menu.items[0].submenu?.insert(1, checkForUpdates)
  menu.items[0].submenu?.insert(2, checkingForUpdates)
}

/**
 * @param {Electron.Menu} appMenu
 */
function setupIpcEventListeners (appMenu) {
  ipcMain.on(ipcMainEvents.UPDATE_CHECK_STARTED, () => {
    getItemById('checkForUpdates').visible = false
    getItemById('checkingForUpdates').visible = true
  })

  ipcMain.on(ipcMainEvents.UPDATE_CHECK_FINISHED, () => {
    getItemById('checkForUpdates').visible = true
    getItemById('checkingForUpdates').visible = false
  })

  /**
   * Get an item from the main app menu or fail with a useful error message.
   * @param {string} id
   * @returns {Electron.MenuItem}
   */
  function getItemById (id) {
    const item = appMenu.getMenuItemById(id)
    if (!item) throw new Error(`Unknown app menu item id: ${id}`)
    return item
  }
}

module.exports = {
  setupAppMenu
}
