'use strict'

const assert = require('assert').strict
const { JobStats } = require('../job-stats')

describe('JobStats', function () {
  beforeEach(function () {
    return new JobStats().reset()
  })

  it('returns zero jobs initially', function () {
    const stats = new JobStats()
    const totalCount = stats.getTotalJobsCompleted()
    assert.strictEqual(totalCount, 0)
  })

  it('records Saturn job count and includes it in total jobs', function () {
    const stats = new JobStats()
    stats.setModuleJobsCompleted('saturn', 1)

    const totalCompleted = stats.getTotalJobsCompleted()
    assert.strictEqual(totalCompleted, 1)
  })

  it('separates job counts for different modules', function () {
    const stats = new JobStats()
    stats.setModuleJobsCompleted('saturn', 1)

    stats.setModuleJobsCompleted('another', 10)
    assert.strictEqual(stats.getTotalJobsCompleted(), 11)

    stats.setModuleJobsCompleted('saturn', 100)
    assert.strictEqual(stats.getTotalJobsCompleted(), 110)
  })

  it('preserves counters across restarts', function () {
    new JobStats().setModuleJobsCompleted('saturn', 1)
    const totalCompleted = new JobStats().getTotalJobsCompleted()
    assert.strictEqual(totalCompleted, 1)
  })
})
