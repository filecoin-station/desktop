const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  startSaturnNode: () => ipcRenderer.invoke('node:start'),
  stopSaturnNode: () => ipcRenderer.invoke('node:stop'),
  isSaturnNodeRunning: () => ipcRenderer.invoke('node:isRunning'),
  isSaturnNodeReady: () => ipcRenderer.invoke('node:isReady'),
  getSaturnNodeWebUrl: () => ipcRenderer.invoke('node:getWebUrl')
})
