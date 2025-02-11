'use strict'

const { app } = require('electron')
const os = require('os')
const packageJson = require('../package.json')
const path = require('path')
const assert = require('assert')

const { getBuildVersion } = require('./build-version')

const appIDs = {
  darwin: 'network.checker.app',
  win32: 'Checker',
  linux: 'checker'
}

module.exports = Object.freeze({
  CACHE_ROOT: getCacheRoot(),
  STATE_ROOT: getStateRoot(),
  LEGACY_CACHE_HOME: getLegacyCacheHome(),
  IS_MAC: os.platform() === 'darwin',
  IS_WIN: os.platform() === 'win32',
  IS_APPIMAGE: typeof process.env.APPIMAGE !== 'undefined',
  CHECKER_VERSION: packageJson.version,
  BUILD_VERSION: getBuildVersion(packageJson),

  ELECTRON_VERSION: process.versions.electron
})

// Replace with `app.get('localUserData')` after this PR is landed & released:
// https://github.com/electron/electron/pull/34337
function getCacheRoot () {
  if (process.env.CHECKER_ROOT) {
    return path.join(process.env.CHECKER_ROOT, 'cache')
  }

  const platform = os.platform()
  switch (platform) {
    case 'darwin':
      return path.join(app.getPath('home'), 'Library', 'Caches', appIDs.darwin)
    case 'win32':
      assert(
        process.env.TEMP,
        'Unsupported Windows environment: TEMP must be set.'
      )
      return path.join(process.env.TEMP, appIDs.win32)
    case 'linux':
      return path.join(
        process.env.XDG_CACHE_HOME || path.join(app.getPath('home'), '.cache'),
        appIDs.linux
      )
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

function getStateRoot () {
  if (process.env.CHECKER_ROOT) {
    return path.join(process.env.CHECKER_ROOT, 'state')
  }

  const platform = os.platform()
  switch (platform) {
    case 'darwin':
      return path.join(
        app.getPath('home'),
        'Library',
        'Application Support',
        appIDs.darwin
      )
    case 'win32':
      assert(
        process.env.LOCALAPPDATA,
        'Unsupported Windows environment: LOCALAPPDATA must be set.'
      )
      return path.join(process.env.LOCALAPPDATA, appIDs.win32)
    case 'linux':
      return path.join(
        process.env.XDG_STATE_HOME ||
          path.join(app.getPath('home'), '.local', 'state'),
        appIDs.linux
      )
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

// Used for migrations
function getLegacyCacheHome () {
  if (process.env.CHECKER_ROOT) {
    return path.join(process.env.CHECKER_ROOT, 'cache')
  }

  const platform = os.platform()
  switch (platform) {
    case 'darwin': // macOS
      return path.join(app.getPath('home'), 'Library', 'Caches', app.name)
    case 'win32':
      if (!process.env.LOCALAPPDATA) {
        throw new Error(
          'Unsupported Windows environment: LOCALAPPDATA must be set.'
        )
      }
      return path.join(process.env.LOCALAPPDATA, app.name)
    case 'linux':
      return path.join(
        process.env.XDG_CACHE_HOME || path.join(app.getPath('home'), '.cache'),
        app.name
      )
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}
