'use strict'

const { spawn } = require('node:child_process')
const { join } = require('node:path')
const { once } = require('node:events')

/** @typedef {import('app-builder-lib').AfterPackContext} AfterPackContext */

/**
 * @param {AfterPackContext} context
 */
exports.default = async function (context) {
  const cwd = join(
    context.appOutDir,
    'Filecoin Station.app',
    'Contents',
    'Resources',
    'app.asar.unpacked',
    'node_modules',
    '@filecoin-station',
    'core'
  )
  const npmInstall = spawn('npm', ['install', '--omit=dev'], { cwd })
  npmInstall.stdout.pipe(process.stdout)
  npmInstall.stderr.pipe(process.stderr)
  await once(npmInstall, 'exit')
}
