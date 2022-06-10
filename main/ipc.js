const { ipcMain } = require('electron')

const saturnNode = require('./saturn-node')

module.exports = function () {
  ipcMain.handle('node:isOn', saturnNode.isOn)
  ipcMain.handle('node:start', saturnNode.start)
  ipcMain.handle('node:stop', saturnNode.stop)
}
