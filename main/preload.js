'use strict'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  stationBuildVersion: process.env.STATION_BUILD_VERSION,

  getAllActivities: () => ipcRenderer.invoke('station:getAllActivities'),

  /**
   * @param {(Activity: import('./typings').Activity) => void} callback
   */
  onActivityLogged (callback) {
    /** @type {(event: import('electron').IpcRendererEvent, ...args: any[]) => void} */
    const listener = (_event, activities) => callback(activities)

    ipcRenderer.on('station:activity-logged', listener)

    return function unsubscribe () {
      ipcRenderer.removeListener('station:activity-logged', listener)
    }
  },

  getTotalJobsCompleted: () => ipcRenderer.invoke('station:getTotalJobsCompleted'),

  /**
   * @param {(totalJobsCompleted: number) => void} callback
   */
  onJobStatsUpdated (callback) {
    /** @type {(event: import('electron').IpcRendererEvent, ...args: any[]) => void} */
    const listener = (_event, totalJobCount) => callback(totalJobCount)

    ipcRenderer.on('station:job-stats-updated', listener)

    return function unsubscribe () {
      ipcRenderer.removeListener('station:job-stats-updated', listener)
    }
  },

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
    setOnboardingCompleted: () => ipcRenderer.invoke('station:setOnboardingCompleted'),
    getUserConsent: () => ipcRenderer.invoke('station:getUserConsent'),
    setUserConsent: (/** @type {boolean} */ consent) => ipcRenderer.invoke('station:setUserConsent', consent)
  }
})
