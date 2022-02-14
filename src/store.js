const electron = require('electron')
const Store = require('electron-store')

const defaults = {
  // https://github.com/sindresorhus/electron-store#defaults
  language: (electron.app || electron.remote.app).getLocale() // useful for i18n
}

const migrations = {
  // https://github.com/sindresorhus/electron-store#migrations
}

const store = new Store({
  defaults,
  migrations
})

module.exports = store
