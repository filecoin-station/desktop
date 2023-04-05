'use strict'

const os = require('os')
const packageJson = require('../package.json')

const { getBuildVersion } = require('./build-version')

module.exports = Object.freeze({
  IS_MAC: os.platform() === 'darwin',
  IS_WIN: os.platform() === 'win32',
  IS_APPIMAGE: typeof process.env.APPIMAGE !== 'undefined',
  STATION_VERSION: packageJson.version,
  BUILD_VERSION: getBuildVersion(packageJson),

  ELECTRON_VERSION: process.versions.electron
})
