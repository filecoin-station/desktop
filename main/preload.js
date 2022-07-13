const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  startSaturnNode: () => ipcRenderer.invoke('saturn:start'),
  stopSaturnNode: () => ipcRenderer.invoke('saturn:stop'),
  isSaturnNodeRunning: () => ipcRenderer.invoke('saturn:isRunning'),
  isSaturnNodeReady: () => ipcRenderer.invoke('saturn:isReady'),
  getSaturnNodeLog: () => ipcRenderer.invoke('saturn:getLog'),
  getSaturnNodeWebUrl: () => ipcRenderer.invoke('saturn:getWebUrl')
})
