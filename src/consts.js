const os = require('os')
const packageJson = require('../package.json')

module.exports = Object.freeze({
  IS_MAC: os.platform() === 'darwin',
  IS_WIN: os.platform() === 'win32',
  IS_APPIMAGE: typeof process.env.APPIMAGE !== 'undefined',
  STATION_VERSION: packageJson.version,
  ELECTRON_VERSION: process.versions.electron
})
