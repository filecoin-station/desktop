'use strict'

const Store = require('electron-store')
const electron = require('electron')

const defaults = {
  // https://github.com/sindresorhus/electron-store#defaults
  language: (electron.app).getLocale() // useful for i18n
}

/** @type {import('electron-store').Options<{language: string}>["migrations"]} */
const migrations = {
  // https://github.com/sindresorhus/electron-store#migrations
}

const store = new Store({
  defaults,
  migrations
})

module.exports = store
