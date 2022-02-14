const { Menu, Tray, app } = require('electron')
const path = require('path')
const { IS_MAC } = require('./consts')

const on = 'on'
// const off = 'off'
function icon (state) {
  const dir = path.resolve(path.join(__dirname, '../assets/tray'))
  if (IS_MAC) return path.join(dir, `${state}-macos.png`)
  return path.join(dir, `${state}.png`)
}

module.exports = function (ctx) {
  const tray = new Tray(icon(on))
  const contextMenu = Menu.buildFromTemplate([
    {
      id: 'showUi',
      label: 'Show UI',
      click: () => ctx.showUI()
    },
    { type: 'separator' },
    {
      label: 'Quit Station',
      click: () => app.quit(),
      accelerator: IS_MAC ? 'Command+Q' : null
    }
  ])
  tray.setToolTip('Filecoin Station')
  tray.setContextMenu(contextMenu)
}
