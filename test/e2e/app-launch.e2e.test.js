'use strict'

const { expect, test } = require('@playwright/test')
const { _electron: electron } = require('playwright')
const { fetch } = require('undici')
const path = require('path')

const TIMEOUT_MULTIPLIER = process.env.CI ? 10 : 1

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
      },
      timeout: 30000 * TIMEOUT_MULTIPLIER
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

  test('navigate to wallet input', async () => {
    await mainWindow.click('button:has-text("Continue")')
    await mainWindow.click('button:has-text("Continue")')
    await mainWindow.click('button:has-text("Accept")')
    expect(await mainWindow.title()).toBe('Login')
  })

  test('enter FIL address', async () => {
    await mainWindow.fill('input.fil-address', 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa')
    await mainWindow.click('button.submit-address')
    expect(await mainWindow.title()).toBe('Filecoin Station')
  })

  test('wait for Saturn node to get ready', async () => {
    await mainWindow.waitForFunction(() => {
      // waitForFunction does not support promises.
      // As a workaround, we start the async task in background and store the result on `window`
      window.electron.saturnNode
        .isReady()
        .then(ready => Object.assign(window, { __saturnNodeIsReady: ready }))

      // Return the last observed value. It may be undefined if the promise above has not finished yet
      return (/** @type {any} */(window)).__saturnNodeIsReady
    }, [], { timeout: 1000 * TIMEOUT_MULTIPLIER })
  })

  test('saturn WebUI is available', async () => {
    const saturnWebUrl = await mainWindow.evaluate(() => window.electron.saturnNode.getWebUrl())
    console.log('Saturn WebUI URL: %s', saturnWebUrl)
    const response = await fetch(saturnWebUrl, { redirect: 'manual' })
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toMatch(/address\/f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa$/)
  })

  test('renders Saturn WebUI in <iframe>', async () => {
    await mainWindow.click('a#link-to-saturn')
    const saturnWebUrl = await mainWindow.evaluate(() => window.electron.saturnNode.getWebUrl())
    const iframeElem = await mainWindow.waitForSelector('#module-webui')
    expect(await iframeElem.getAttribute('src'), 'iframe URL').toBe(saturnWebUrl)
  })
})
