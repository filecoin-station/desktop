const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  startSaturnNode: () => ipcRenderer.invoke('node:start'),
  stopSaturnNode: () => ipcRenderer.invoke('node:stop'),
  isSaturnNodeOn: () => ipcRenderer.invoke('node:isOn')
})
