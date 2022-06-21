const { ipcMain } = require('electron')

const saturnNode = require('./saturn-node')

module.exports = function () {
  ipcMain.handle('saturn:isRunning', saturnNode.isRunning)
  ipcMain.handle('saturn:isReady', saturnNode.isReady)
  ipcMain.handle('saturn:start', saturnNode.start)
  ipcMain.handle('saturn:stop', saturnNode.stop)
  ipcMain.handle('saturn:getWebUrl', saturnNode.getWebUrl)
}
