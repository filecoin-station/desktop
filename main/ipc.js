const { ipcMain } = require('electron')

const saturnNode = require('./saturn-node')

module.exports = function () {
  ipcMain.handle('node:isRunning', saturnNode.isRunning)
  ipcMain.handle('node:isReady', saturnNode.isReady)
  ipcMain.handle('node:start', saturnNode.start)
  ipcMain.handle('node:stop', saturnNode.stop)
  ipcMain.handle('node:getWebUrl', saturnNode.getWebUrl)
}
