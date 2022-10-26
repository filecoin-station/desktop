'use strict'

const { InfluxDB } = require('@influxdata/influxdb-client')
const { createHash } = require('node:crypto')
const { getStationID } = require('./station-config')
const { getFilAddress } = require('./station-config')

/** @typedef {import('@influxdata/influxdb-client').Point} Point */

const client = new InfluxDB({
  url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
  // station-anonymous-write
  token: '0fZyu9zjDvYlaNfOeuwgnQoUI0VcSzeYDpnOLjQyr30mz-Plqels5JHEwgKRbtCcDJbQmv62VnOV_FsZVxgoow=='
})

const writeClient = client.getWriteApi(
  'Filecoin Station', // org
  'station', // bucket
  'ns' // precision
)

setInterval(() => {
  writeClient.flush()
}, 5000).unref()

/**
 * @param {Point} point
 */
const writePoint = point => {
  const filAddress = getFilAddress()
  if (filAddress) {
    const hash = createHash('sha256').update(filAddress).digest('hex')
    point.stringField('wallet', hash)
  }
  point.stringField('station', getStationID())
  writeClient.writePoint(point)
}

module.exports = {
  writeClient,
  writePoint
}
