const { dialog } = require('electron')
const { IS_MAC } = require('./consts')

module.exports = {
  showDialogSync
}

/**
 * NOTE: always send the buttons in the order [OK, Cancel, ...Actions].
 * See this post for more interesting information about the topic:
 * https://medium.muz.li/ok-key-and-cancel-key-which-one-should-be-set-up-on-the-left-4780e86c16eb
 *
 * @param {import('electron').MessageBoxSyncOptions & {title: string}} args
 * @returns
 */
function showDialogSync ({
  title,
  message,
  type = 'info',
  buttons = ['OK', 'Cancel'],
  ...opts
}) {
  const options = {
    type,
    buttons,
    title,
    message,
    ...opts
  }

  if (IS_MAC) {
    options.message = title
    options.detail = message
  }

  const isInverse = !IS_MAC

  if (isInverse) {
    options.buttons.reverse()
  }

  if (buttons.length > 1) {
    options.defaultId = isInverse ? buttons.length - 1 : 0
    options.cancelId = isInverse ? buttons.length - 2 : 1
  }

  const selected = dialog.showMessageBoxSync(options)

  return isInverse
    ? buttons.length - selected - 1
    : selected
}
