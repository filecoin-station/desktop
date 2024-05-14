type RewardsRecord = {
  timestamp: string;
  totalRewardsReceived: number;
  totalScheduledRewards: number;
}

function getRandomNumber (min: number, max: number) {
  return Math.random() * (max - min) + min
}

const mockData: RewardsRecord[] = []

const config = {
  recordsCount: 30,
  minReward: 0.05,
  maxReward: 0.1,
  payoutFrequency: 7
}

const currentDate = new Date()
const date = new Date(new Date().setDate(currentDate.getDate() - config.recordsCount))

let rewardsAccumulatedInWindow = 0

for (let index = 0; index < config.recordsCount; index++) {
  const prevRecordReceived = mockData.at(-1)?.totalRewardsReceived || 0
  const timestamp = date.toISOString()

  if (index % config.payoutFrequency === 0) {
    mockData.push({
      timestamp,
      totalRewardsReceived: prevRecordReceived + rewardsAccumulatedInWindow,
      totalScheduledRewards: 0
    })
  } else {
    const amount = getRandomNumber(config.minReward, config.maxReward)
    rewardsAccumulatedInWindow += amount
    mockData.push({
      timestamp,
      totalRewardsReceived: prevRecordReceived,
      totalScheduledRewards: amount
    })
  }

  date.setDate(date.getDate() + 1)
}

export { mockData }
