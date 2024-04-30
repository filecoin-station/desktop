'use strict'

const { app, clipboard } = require('electron')
const wallet = require('./wallet')
const { showDialogSync } = require('./dialog')

/** @typedef {import('./typings').Context} Context */

/**
 * @param {Context} ctx
 */
async function setup (ctx) {
  ctx.toggleOpenAtLogin = () => {
    const openAtLogin = !app.getLoginItemSettings().openAtLogin
    app.setLoginItemSettings({ openAtLogin })
  }

  ctx.isOpenAtLogin = () => {
    return app.getLoginItemSettings().openAtLogin
  }

  ctx.exportSeedPhrase = async () => {
    const button = showDialogSync({
      title: 'Export Seed Phrase',
      // eslint-disable-next-line max-len
      message: 'The seed phrase is used in order to back up your wallet, or move it to a different machine. Please be cautious, as anyone with access to it has full control over your wallet and funds.',
      type: 'info',
      buttons: ['Cancel', 'Copy to Clipboard']
    })
    if (button === 1) {
      clipboard.writeText(await wallet.getSeedPhrase())
    }
  }
}

module.exports = {
  setup
}
