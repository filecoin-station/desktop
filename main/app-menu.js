'use strict'

const fs = require('node:fs/promises')
const { Menu, MenuItem, ipcMain, dialog, BrowserWindow } = require('electron')
const { ipcMainEvents } = require('./ipc')
const { getLog } = require('./saturn-node')

function setupAppMenu (/** @type {import('./typings').Context} */ ctx) {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  setupCheckForUpdatesMenuItem(ctx, menu)

  // File menu
  menu.items[1].submenu?.insert(1, new MenuItem({
    label: 'Save Saturn Module Logs As…',
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
  // GitHub issues tracking the work to add this menu item on other platforms:
  //  - Windows: https://github.com/filecoin-project/filecoin-station/issues/63
  //  - Linux: https://github.com/filecoin-project/filecoin-station/issues/64
  if (process.platform !== 'darwin') return

  // App menu
  menu.items[0].submenu?.insert(1, new MenuItem({
    id: 'checkForUpdates',
    label: 'Check For Updates...',
    click: () => { ctx.manualCheckForUpdates() }
  }))
  menu.items[0].submenu?.insert(2, new MenuItem({
    id: 'checkingForUpdates',
    label: 'Checking For Updates',
    enabled: false,
    visible: false
  }))
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
