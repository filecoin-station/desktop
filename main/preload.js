'use strict'

/** @typedef {import('electron').IpcRendererEvent} IpcRendererEvent */
/** @typedef {import('./typings').Activity} Activity */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  stationBuildVersion: process.env.STATION_BUILD_VERSION,

  getAllActivities: () => ipcRenderer.invoke('station:getAllActivities'),
  getTotalJobsCompleted: () => ipcRenderer.invoke('station:getTotalJobsCompleted'),

  saturnNode: {
    start: () => ipcRenderer.invoke('saturn:start'),
    stop: () => ipcRenderer.invoke('saturn:stop'),
    isRunning: () => ipcRenderer.invoke('saturn:isRunning'),
    isReady: () => ipcRenderer.invoke('saturn:isReady'),
    getLog: () => ipcRenderer.invoke('saturn:getLog'),
    getWebUrl: () => ipcRenderer.invoke('saturn:getWebUrl'),
    getFilAddress: () => ipcRenderer.invoke('saturn:getFilAddress'),
    setFilAddress: (/** @type {string | undefined} */ address) => ipcRenderer.invoke('saturn:setFilAddress', address)
  },
  stationConfig: {
    getFilAddress: () => ipcRenderer.invoke('station:getFilAddress'),
    setFilAddress: (/** @type {string | undefined} */ address) => ipcRenderer.invoke('station:setFilAddress', address),
    getOnboardingCompleted: () => ipcRenderer.invoke('station:getOnboardingCompleted'),
    setOnboardingCompleted: () => ipcRenderer.invoke('station:setOnboardingCompleted')
  },
  stationEvents: {
    onActivityLogged: (/** @type {(value: Activity) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, activities) => callback(activities)
      ipcRenderer.on('station:activity-logged', listener)
      return () => ipcRenderer.removeListener('station:activity-logged', callback)
    },
    onJobProcessed: (/** @type {(value: number) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, totalJobCount) => callback(totalJobCount)
      ipcRenderer.on('station:job-stats-updated', listener)
      return () => ipcRenderer.removeListener('station:job-stats-updated', callback)
    },
    onEarningsChanged: (/** @type {(value: number) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, totalEarnings) => callback(totalEarnings)

      ipcRenderer.on('station:earnings-counter', listener)
      return () => ipcRenderer.removeListener('station:earnings-counter', callback)
    }
  },
  dialogs: {
    confirmChangeWalletAddress: () => ipcRenderer.invoke('dialogs:confirmChangeWalletAddress')
  }
})
