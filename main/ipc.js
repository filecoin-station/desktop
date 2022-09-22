'use strict'

const { ipcMain } = require('electron')

const saturnNode = require('./saturn-node')
const stationConfig = require('./station-config')

/** @typedef {import('./typings').Context} Context */

const ipcMainEvents = Object.freeze({
  ACTIVITY_LOGGED: 'station:activity-logged',
  JOB_STATS_UPDATED: 'station:job-stats-updated',

  UPDATE_CHECK_STARTED: 'station:update-check:started',
  UPDATE_CHECK_FINISHED: 'station:update-check:finished'
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
  ipcMain.handle('station:getFilAddress', saturnNode.getFilAddress)
  ipcMain.handle('station:setFilAddress', (_event, address) => saturnNode.setFilAddress(address))
  ipcMain.handle('station:getOnboardingCompleted', stationConfig.getOnboardingCompleted)
  ipcMain.handle('station:setOnboardingCompleted', (_event) => stationConfig.setOnboardingCompleted())

  ipcMain.handle('station:getAllActivities', (_event, _args) => ctx.getAllActivities())
  ipcMain.handle('station:getTotalJobsCompleted', (_event, _args) => ctx.getTotalJobsCompleted())
}

module.exports = {
  setupIpcMain,
  ipcMainEvents
}
