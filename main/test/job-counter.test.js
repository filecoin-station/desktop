'use strict'

const assert = require('assert').strict
const { JobCounter } = require('../job-counter')

describe('JobCounter', function () {
  beforeEach(function () {
    return new JobCounter().reset()
  })

  it('returns zero jobs initially', function () {
    const jobCounter = new JobCounter()
    const totalCount = jobCounter.getTotalJobCount()
    assert.strictEqual(totalCount, 0)
  })

  it('records Saturn job count and includes it in total jobs', function () {
    const jobCounter = new JobCounter()
    jobCounter.setModuleJobCount('saturn', 1)

    const totalCount = jobCounter.getTotalJobCount()
    assert.strictEqual(totalCount, 1)
  })

  it('separates job counts for different modules', function () {
    const jobCounter = new JobCounter()
    jobCounter.setModuleJobCount('saturn', 1)

    jobCounter.setModuleJobCount('another', 10)
    assert.strictEqual(jobCounter.getTotalJobCount(), 11)

    jobCounter.setModuleJobCount('saturn', 100)
    assert.strictEqual(jobCounter.getTotalJobCount(), 110)
  })

  it('preserves counters across restarts', function () {
    new JobCounter().setModuleJobCount('saturn', 1)
    const totalCount = new JobCounter().getTotalJobCount()
    assert.strictEqual(totalCount, 1)
  })
})
