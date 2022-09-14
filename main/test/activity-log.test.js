'use strict'

const assert = require('assert').strict
const { ActivityLog } = require('../activity-log')
const { assertTimestampIsCloseToNow, pickProps } = require('./test-helpers')

/** @typedef {import('../typings').RecordActivityOptions} RecordActivityOptions */

describe('ActivityLog', function () {
  beforeEach(function () { return ActivityLog.reset() })

  it('record events and assign them timestamp and id ', function () {
    const activityLog = new ActivityLog()
    const entryCreated = activityLog.recordEvent(givenActivity({
      source: 'Station',
      type: 'info',
      message: 'Hello world!'
    }))

    assert.strictEqual(activityLog.getAllEntries().length, 1)
    assert.deepStrictEqual(entryCreated, activityLog.getAllEntries()[0])

    const { timestamp, ...entry } = activityLog.getAllEntries()[0]
    assert.deepStrictEqual(entry, {
      id: '1',
      source: 'Station',
      type: 'info',
      message: 'Hello world!'
    })

    assertTimestampIsCloseToNow(timestamp, 'event.timestamp')
  })

  it('assigns unique ids', function () {
    const activityLog = new ActivityLog()
    activityLog.recordEvent(givenActivity({ message: 'one' }))
    activityLog.recordEvent(givenActivity({ message: 'two' }))
    assert.deepStrictEqual(activityLog.getAllEntries().map(it => pickProps(it, 'id', 'message')), [
      { id: '1', message: 'one' },
      { id: '2', message: 'two' }
    ])
  })

  it('preserves events across restarts', function () {
    new ActivityLog().recordEvent(givenActivity({ message: 'first run' }))
    const activityLog = new ActivityLog()
    activityLog.recordEvent(givenActivity({ message: 'second run' }))
    assert.deepStrictEqual(activityLog.getAllEntries().map(it => pickProps(it, 'id', 'message')), [
      { id: '1', message: 'first run' },
      { id: '2', message: 'second run' }
    ])
  })

  it('limits the log to the most recent 50 entries', function () {
    this.timeout(10000)

    const log = new ActivityLog()
    for (let i = 0; i < 110; i++) {
      log.recordEvent(givenActivity({ message: `event ${i}` }))
    }
    const entries = log.getAllEntries()
    assert.deepStrictEqual(
      [entries.at(0)?.message, entries.at(-1)?.message],
      ['event 10', 'event 109']
    )
  })
})

/**
 * @param {Partial<RecordActivityOptions>} [props]
 * @returns {RecordActivityOptions}
 */
function givenActivity (props) {
  return {
    source: 'Station',
    type: 'info',
    message: 'some message',
    ...props
  }
}
