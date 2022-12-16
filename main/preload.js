'use strict'

/** @typedef {import('electron').IpcRendererEvent} IpcRendererEvent */
/** @typedef {import('./typings').Activity} Activity */
/** @typedef {import('./typings').FILTransaction} TransactionMessage */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  stationBuildVersion: process.env.STATION_BUILD_VERSION,

  getAllActivities: () => ipcRenderer.invoke('station:getAllActivities'),
  getTotalJobsCompleted: () => ipcRenderer.invoke('station:getTotalJobsCompleted'),

  getUpdaterStatus: () => ipcRenderer.invoke('station:getUpdaterStatus'),
  restartToUpdate: () => ipcRenderer.invoke('station:restartToUpdate'),
  openReleaseNotes: () => ipcRenderer.invoke('station:openReleaseNotes'),

  saturnNode: {
    start: () => ipcRenderer.invoke('saturn:start'),
    stop: () => ipcRenderer.invoke('saturn:stop'),
    isRunning: () => ipcRenderer.invoke('saturn:isRunning'),
    isReady: () => ipcRenderer.invoke('saturn:isReady'),
    getLog: () => ipcRenderer.invoke('saturn:getLog'),
    getWebUrl: () => ipcRenderer.invoke('saturn:getWebUrl'),
    getFilAddress: () => ipcRenderer.invoke('saturn:getFilAddress'), // soon to be removed
    setFilAddress: (/** @type {string | undefined} */ address) => ipcRenderer.invoke('saturn:setFilAddress', address) // soon to be removed
  },
  stationConfig: {
    getOnboardingCompleted: () => ipcRenderer.invoke('station:getOnboardingCompleted'),
    setOnboardingCompleted: () => ipcRenderer.invoke('station:setOnboardingCompleted'),
    getStationWalletAddress: () => ipcRenderer.invoke('station:getStationWalletAddress'),
    getDestinationWalletAddress: () => ipcRenderer.invoke('station:getDestinationWalletAddress'),
    setDestinationWalletAddress: (/** @type {string | undefined} */ address) => ipcRenderer.invoke('station:setDestinationWalletAddress', address),
    getStationWalletBalance: () => ipcRenderer.invoke('station:getStationWalletBalance'),
    getStationWalletTransactionsHistory: () => ipcRenderer.invoke('station:getStationWalletTransactionsHistory'),
    transferAllFundsToDestinationWallet: () => ipcRenderer.invoke('station:transferAllFundsToDestinationWallet'),
    browseTransactionTracker: (/** @type {string } */ transactionHash) => ipcRenderer.invoke('station:browseTransactionTracker', transactionHash)
  },
  stationEvents: {
    onActivityLogged: (/** @type {(value: Activity) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, activities) => callback(activities)
      ipcRenderer.on('station:activity-logged', listener)
      return () => ipcRenderer.removeListener('station:activity-logged', listener)
    },
    onJobProcessed: (/** @type {(value: number) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, totalJobCount) => callback(totalJobCount)
      ipcRenderer.on('station:job-stats-updated', listener)
      return () => ipcRenderer.removeListener('station:job-stats-updated', listener)
    },
    onEarningsChanged: (/** @type {(value: number) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, totalEarnings) => callback(totalEarnings)
      ipcRenderer.on('station:earnings-counter', listener)
      return () => ipcRenderer.removeListener('station:earnings-counter', listener)
    },
    onUpdateAvailable: (/** @type {() => void} */ callback) => {
      const listener = () => callback()
      ipcRenderer.on('station:update-available', listener)
      return () => ipcRenderer.removeListener('station:update-available', listener)
    },
    onBalanceUpdate: (/** @type {(value: number) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, balance) => callback(balance)
      ipcRenderer.on('station:wallet-balance-update', listener)
      return () => ipcRenderer.removeListener('station:wallet-balance-update', listener)
    },
    onTransactionUpdate: (/** @type {(value: TransactionMessage) => void} */ callback) => {
      /** @type {(event: IpcRendererEvent, ...args: any[]) => void} */
      const listener = (_event, transactions) => callback(transactions)
      ipcRenderer.on('station:transaction-update', listener)
      return () => ipcRenderer.removeListener('station:transaction-update', listener)
    }
  },
  dialogs: {
    confirmChangeWalletAddress: () => ipcRenderer.invoke('dialogs:confirmChangeWalletAddress')
  }
})
