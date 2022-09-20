'use strict'

const assert = require('assert').strict
const { JobCounter } = require('../job-counter')

describe('JobCounter', function () {
  beforeEach(function () {
    return new JobCounter().reset()
  })

  it('returns zero jobs initially', function () {
    const jobCounter = new JobCounter()
    const totalCount = jobCounter.getNumberOfAllJobsProcessed()
    assert.strictEqual(totalCount, 0)
  })

  it('records Saturn job count and includes it in total jobs', function () {
    const jobCounter = new JobCounter()
    jobCounter.setJobsProcessedByModule('saturn', 1)

    const totalCount = jobCounter.getNumberOfAllJobsProcessed()
    assert.strictEqual(totalCount, 1)
  })

  it('separates job counts for different modules', function () {
    const jobCounter = new JobCounter()
    jobCounter.setJobsProcessedByModule('saturn', 1)

    jobCounter.setJobsProcessedByModule('another', 10)
    assert.strictEqual(jobCounter.getNumberOfAllJobsProcessed(), 11)

    jobCounter.setJobsProcessedByModule('saturn', 100)
    assert.strictEqual(jobCounter.getNumberOfAllJobsProcessed(), 110)
  })

  it('preserves countesr across restarts', function () {
    new JobCounter().setJobsProcessedByModule('saturn', 1)
    const totalCount = new JobCounter().getNumberOfAllJobsProcessed()
    assert.strictEqual(totalCount, 1)
  })
})
