'use strict'

const { ipcMain } = require('electron')

const saturnNode = require('./saturn-node')
const stationConfig = require('./station-config')

/** @typedef {import('./typings').Context} Context */

const ipcMainEvents = Object.freeze({
  ACTIVITY_LOGGED: 'station:activity-logged',
  JOB_STATS_UPDATED: 'station:job-stats-updated',

  UPDATE_CHECK_STARTED: 'station:update-check:started',
  UPDATE_CHECK_FINISHED: 'station:update-check:finished',
  UPDATE_AVAILABLE: 'station:update-available'
})

function setupIpcMain (/** @type {Context} */ ctx) {
  ipcMain.handle('saturn:isRunning', saturnNode.isRunning)
  ipcMain.handle('saturn:isReady', saturnNode.isReady)
  ipcMain.handle('saturn:start', _event => saturnNode.start(ctx))
  ipcMain.handle('saturn:stop', saturnNode.stop)
  ipcMain.handle('saturn:getLog', saturnNode.getLog)
  ipcMain.handle('saturn:getWebUrl', saturnNode.getWebUrl)
  ipcMain.handle('saturn:getFilAddress', saturnNode.getFilAddress)
  ipcMain.handle('saturn:setFilAddress', (_event, address) => saturnNode.setFilAddress(address))
  // Station-wide config
  ipcMain.handle('station:getOnboardingCompleted', stationConfig.getOnboardingCompleted)
  ipcMain.handle('station:setOnboardingCompleted', (_event) => stationConfig.setOnboardingCompleted())
  // Wallet-wide config
  ipcMain.handle('station:getStationWalletAddress', stationConfig.getStationWalletAddress)
  ipcMain.handle('station:getDestinationWalletAddress', stationConfig.getDestinationWalletAddress)
  ipcMain.handle('station:setDestinationWalletAddress', (_event, address) => stationConfig.setDestinationWalletAddress(address))
  ipcMain.handle('station:getStationWalletBalance', stationConfig.getStationWalletBalance)
  ipcMain.handle('station:getStationWalletTransactionsHistory', stationConfig.getStationWalletTransactionsHistory)
  ipcMain.handle('station:transferAllFundsToDestinationWallet', (_event, _args) => stationConfig.transferAllFundsToDestinationWallet())

  ipcMain.handle('station:getAllActivities', (_event, _args) => ctx.getAllActivities())
  ipcMain.handle('station:getTotalJobsCompleted', (_event, _args) => ctx.getTotalJobsCompleted())

  ipcMain.handle('dialogs:confirmChangeWalletAddress', (_event, _args) => ctx.confirmChangeWalletAddress())

  ipcMain.handle('station:restartToUpdate', (_event, _args) => ctx.restartToUpdate())
  ipcMain.handle('station:openReleaseNotes', (_event) => ctx.openReleaseNotes())
  ipcMain.handle('station:getUpdaterStatus', (_events, _args) => ctx.getUpdaterStatus())
  ipcMain.handle('station:browseTransactionTracker', (_events, transactionHash) => ctx.browseTransactionTracker(transactionHash))
}

module.exports = {
  setupIpcMain,
  ipcMainEvents
}
