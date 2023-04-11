'use strict'

const { app } = require('electron')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const { createHash } = require('node:crypto')
const { getDestinationWalletAddress } = require('./station-config')
const wallet = require('./wallet')
const Sentry = require('@sentry/node')
const { platform, arch } = require('node:os')
const pkg = require('../package.json')

const client = new InfluxDB({
  url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
  token:
    // station-anonymous-write
    // eslint-disable-next-line max-len
    '0fZyu9zjDvYlaNfOeuwgnQoUI0VcSzeYDpnOLjQyr30mz-Plqels5JHEwgKRbtCcDJbQmv62VnOV_FsZVxgoow=='
})

const writeClient = client.getWriteApi(
  'Filecoin Station', // org
  'station', // bucket
  'ns' // precision
)

setInterval(() => {
  writeClient.flush().catch(err => {
    // Ignore unactionable InfluxDB errors
    // eslint-disable-next-line max-len
    const reg = /HttpError|getAddrInfo|RequestTimedOutError|ECONNRESET|CERT_NOT_YET_VALID/i
    if (!reg.test(String(err))) {
      Sentry.captureException(err)
    }
  })
}, 5_000).unref()

setInterval(() => {
  const point = new Point('ping')
  point.stringField(
    'wallet',
    createHash('sha256').update(wallet.getAddress()).digest('hex')
  )
  const destinationWalletAddress = getDestinationWalletAddress()
  if (destinationWalletAddress) {
    point.stringField(
      'destination_wallet',
      createHash('sha256').update(destinationWalletAddress).digest('hex')
    )
  }
  point.stringField('version', pkg.version)
  point.tag('station', 'desktop')
  point.tag('platform', platform())
  // `os.arch()` returns `x64` when running in a translated environment on ARM64
  // machine, e.g. via macOS Rosetta. We don't provide Apple `arm64` builds yet.
  // As a result, Stations running on Apple Silicon were reporting `x64` arch.
  // To fix the problem, we detect `arm64` translation and report a different
  // architecture.
  point.tag('arch', app.runningUnderARM64Translation ? 'arm64' : arch())
  writeClient.writePoint(point)
}, 10_000).unref()

module.exports = {
  writeClient
}
