const { Menu, MenuItem, ipcMain } = require('electron')
const { ipcMainEvents } = require('./ipc')

function setupAppMenu (/** @type {import('./typings').Context} */ ctx) {
  // Add "Check for updates..." item to the Application menu on MacOS
  // GitHub issues tracking the work to add this menu item on other platforms:
  //  - Windows: https://github.com/filecoin-project/filecoin-station/issues/63
  //  - Linux: https://github.com/filecoin-project/filecoin-station/issues/64
  if (process.platform !== 'darwin') return

  const menu = Menu.getApplicationMenu()
  if (!menu) return

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

  Menu.setApplicationMenu(menu)
  setupIpcEventListeners(menu)
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
