'use strict'

const assert = require('assert').strict
const { ActivityLog } = require('../activity-log')
const { assertTimestampIsCloseToNow, pickProps } = require('./test-helpers')

/** @typedef {import('../typings').RecordActivityArgs} RecordActivityOptions */

describe('ActivityLog', function () {
  beforeEach(function () {
    return new ActivityLog().reset()
  })

  it('record activities and assign them timestamp and id ', function () {
    const activityLog = new ActivityLog()
    const activityCreated = activityLog.record(givenActivity({
      source: 'Station',
      type: 'info',
      message: 'Hello world!'
    }))

    assert.strictEqual(activityLog.getAllEntries().length, 1)
    assert.deepStrictEqual(activityCreated, activityLog.getAllEntries()[0])

    const { id, timestamp, ...activity } = activityLog.getAllEntries()[0]
    assert.deepStrictEqual(activity, {
      source: 'Station',
      type: 'info',
      message: 'Hello world!'
    })

    assert.equal(typeof id, 'string')
    assertTimestampIsCloseToNow(timestamp, 'activity.timestamp')
  })

  it('assigns unique ids', function () {
    const activityLog = new ActivityLog()
    activityLog.record(givenActivity({ message: 'one' }))
    activityLog.record(givenActivity({ message: 'two' }))
    const [first, second] = activityLog.getAllEntries()
    assert(first.id !== second.id, `Expected unique ids. Got the same value: ${first.id}`)
  })

  it('preserves activities across restarts', function () {
    new ActivityLog().record(givenActivity({ message: 'first run' }))
    const activityLog = new ActivityLog()
    activityLog.record(givenActivity({ message: 'second run' }))
    assert.deepStrictEqual(activityLog.getAllEntries().map(it => pickProps(it, 'message')), [
      { message: 'first run' },
      { message: 'second run' }
    ])
  })

  it('limits the log to the most recent 50 entries', /** @this {Mocha.Test} */ function () {
    this.timeout(10000)

    const log = new ActivityLog()
    for (let i = 0; i < 110; i++) {
      log.record(givenActivity({ message: `activity ${i}` }))
    }
    const entries = log.getAllEntries()
    assert.deepStrictEqual(
      [entries.at(0)?.message, entries.at(-1)?.message],
      ['activity 10', 'activity 109']
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
