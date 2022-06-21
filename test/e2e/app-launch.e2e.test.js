const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path')
const { request } = require('undici')

const tmp = require('tmp')

// Running test cases one after another
// More examples: https://playwright.dev/docs/api/class-electron
test.describe.serial('Application launch', async () => {
  if (process.env.CI === 'true') test.setTimeout(120_000) // slow CI

  /** @type {import('playwright').ElectronApplication} */
  let electronApp

  /** @type {import('playwright').Page} */
  let mainWindow

  test('starts the electron app', async () => {
    test.slow()

    // Launch Electron app against sandbox fake HOME dir
    const userData = tmp.dirSync({ prefix: 'tmp_home_', unsafeCleanup: true }).name
    electronApp = await electron.launch({
      args: [path.join(__dirname, '..', '..', 'main', 'index.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
        HOME: userData
      }
    })

    // Get the first window that the app opens, wait if necessary.
    mainWindow = await electronApp.firstWindow()
    console.log('WebUI location', await mainWindow.url())

    // Direct Electron console to Node terminal.
    mainWindow.on('console', msg => {
      Promise.all(
        msg.args().map(arg => arg.jsonValue())
      ).then(
        values => console.log(`[WEBUI:${msg.type()}] ${values[0]}`, ...values.slice(1)),
        error => console.log(`[WEBUI:${msg.type()}] %s -- cannot deserialize args.`, msg.text(), error)
      )
    })

    mainWindow.on('pageerror', (err) => { throw err })

    await mainWindow.waitForLoadState()
  })

  test.afterAll(async () => {
    // Exit the app
    electronApp.close()
  })

  test('the window shows the expected title', async () => {
    // See what you can do with 'window':
    // https://playwright.dev/docs/api/class-electronapplication#electron-application-first-window
    // https://playwright.dev/docs/api/class-page
    expect(await mainWindow.title()).toBe('Filecoin Station')
  })

  test('wait for Saturn node to get ready', async () => {
    await mainWindow.waitForFunction(() => window.electron.isSaturnNodeReady(), {})
  })

  test('saturn WebUI is available', async () => {
    const saturnWebUrl = await mainWindow.evaluate(() => window.electron.getSaturnNodeWebUrl())
    console.log('Saturn WebUI URL: %s', saturnWebUrl)
    const response = await request(saturnWebUrl)
    expect(response.statusCode).toBe(200)
    expect(await response.body.text()).toMatch(/Saturn/)
  })

  test('renders Saturn section', async () => {
    await mainWindow.goto(`${mainWindow.url()}saturn`)
    const statusElem = await mainWindow.waitForSelector('#status', { timeout: 500 })
    expect(await statusElem.isChecked(), 'Status switch shows ON').toBe(true)
  })
})
