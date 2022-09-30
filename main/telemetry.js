'use strict'

const { InfluxDB } = require('@influxdata/influxdb-client')

const client = new InfluxDB({
  url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
  // station-anonymous-write
  token: '0fZyu9zjDvYlaNfOeuwgnQoUI0VcSzeYDpnOLjQyr30mz-Plqels5JHEwgKRbtCcDJbQmv62VnOV_FsZVxgoow=='
})

const writeClient = client.getWriteApi(
  'julian.gruber@protocol.ai',
  'station',
  'ns'
)

setInterval(() => {
  writeClient.flush()
}, 5000)

module.exports = {
  writeClient
}
