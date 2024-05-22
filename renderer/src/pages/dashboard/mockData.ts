import { RewardsRecord } from 'src/hooks/StationRewards'

function getRandomNumber (min: number, max: number) {
  return Math.random() * (max - min) + min
}

const mockData: RewardsRecord[] = []

const config = {
  recordsCount: 300,
  minReward: 0.05,
  maxReward: 0.1,
  payoutFrequency: 7
}

const currentDate = new Date()
const date = new Date(new Date().setDate(currentDate.getDate() - (config.recordsCount - 1)))

let rewardsAccumulatedInWindow = 0

for (let index = 0; index < config.recordsCount; index++) {
  const prevRecord = mockData.at(-1)
  const timestamp = date.toISOString()
  const amount = getRandomNumber(config.minReward, config.maxReward)
  rewardsAccumulatedInWindow += amount

  if (index % config.payoutFrequency === 0) {
    mockData.push({
      timestamp,
      totalRewardsReceived: (prevRecord?.totalRewardsReceived || 0) + rewardsAccumulatedInWindow,
      totalScheduledRewards: 0
    })
    rewardsAccumulatedInWindow = 0
  } else {
    mockData.push({
      timestamp,
      totalRewardsReceived: prevRecord?.totalRewardsReceived || 0,
      totalScheduledRewards: (prevRecord?.totalScheduledRewards || 0) + amount
    })
  }

  date.setDate(date.getDate() + 1)
}

export { mockData }
