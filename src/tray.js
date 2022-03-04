const { Menu, Tray, shell, app } = require('electron')
const path = require('path')
const { IS_MAC, STATION_VERSION } = require('./consts')

// Be warned, this one is pretty ridiculous:
// Tray must be global or it will break due to.. GC.
// https://www.electronjs.org/docs/faq#my-apps-tray-disappeared-after-a-few-minutes
let tray = null

const on = 'on'
// const off = 'off'
function icon (state) {
  const dir = path.resolve(path.join(__dirname, '../assets/tray'))
  if (IS_MAC) return path.join(dir, `${state}-macos.png`)
  return path.join(dir, `${state}.png`)
}

module.exports = function (ctx) {
  tray = new Tray(icon(on))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Filecoin Station v${STATION_VERSION}`,
      click: () => { shell.openExternal(`https://github.com/filecoin-project/filecoin-station/releases/v${STATION_VERSION}`) }
    },
    { type: 'separator' },
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
