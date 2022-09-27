'use strict'

const { BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron')
const fs = require('node:fs/promises')
const { getLog } = require('./saturn-node')
const { ipcMainEvents } = require('./ipc')

function setupAppMenu (/** @type {import('./typings').Context} */ ctx) {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  setupCheckForUpdatesMenuItem(ctx, menu)

  const saveSaturnModuleLogAs = new MenuItem({
    label: 'Save Saturn Module Log As…',
    click: async () => {
      const opts = { defaultPath: 'station.txt' }
      const win = BrowserWindow.getFocusedWindow()
      const { filePath } = win
        ? await dialog.showSaveDialog(win, opts)
        : await dialog.showSaveDialog(opts)
      if (filePath) {
        await fs.writeFile(filePath, getLog())
      }
    }
  })
  if (process.platform === 'darwin') {
    // File menu
    menu.items[1].submenu?.insert(0, saveSaturnModuleLogAs)
  } else if (process.platform === 'win32') {
    // File menu
    menu.items[0].submenu?.insert(0, saveSaturnModuleLogAs)
  }

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
  if (process.platform === 'darwin') {
    // Filecoin Station menu
    menu.items[0].submenu?.insert(1, checkForUpdates)
    menu.items[0].submenu?.insert(2, checkingForUpdates)
  } else if (process.platform === 'win32') {
    // Help menu
    menu.items[4].submenu?.insert(0, checkForUpdates)
    menu.items[4].submenu?.insert(1, checkingForUpdates)
  }
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
