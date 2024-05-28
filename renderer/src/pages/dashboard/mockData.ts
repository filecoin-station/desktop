import { modules } from 'src/hooks/StationModules'
import { RewardsRecord } from 'src/hooks/StationRewards'

function getRandomNumber (min: number, max: number) {
  return Math.random() * (max - min) + min
}
function initModulesObj (ids: string[]) {
  return Object.fromEntries(ids.map(id => [id, 0]))
}

const allModuleIds = Object.keys(modules)
const mockData: RewardsRecord[] = []

const config = {
  recordsCount: 10,
  minReward: 0.05,
  maxReward: 0.1,
  payoutFrequency: 7
}

const currentDate = new Date()
const date = new Date(new Date().setDate(currentDate.getDate() - (config.recordsCount - 1)))

const rewardsAccumulatedInWindow = initModulesObj(allModuleIds)

for (let index = 0; index < config.recordsCount; index++) {
  const prevRecord = mockData.at(-1)
  const timestamp = date.toISOString()
  const record = {
    timestamp,
    totalRewardsReceived: initModulesObj(allModuleIds),
    totalScheduledRewards: initModulesObj(allModuleIds)
  }

  for (const modId of allModuleIds) {
    const amount = getRandomNumber(config.minReward, config.maxReward)
    rewardsAccumulatedInWindow[modId] += amount

    if (index !== 0 && index % config.payoutFrequency === 0) {
      record.totalRewardsReceived[modId] =
        (prevRecord?.totalRewardsReceived[modId] || 0) + rewardsAccumulatedInWindow[modId]
      record.totalScheduledRewards[modId] = 0

      rewardsAccumulatedInWindow[modId] = 0
    } else {
      record.totalRewardsReceived[modId] = prevRecord?.totalRewardsReceived[modId] || 0
      record.totalScheduledRewards[modId] = (prevRecord?.totalScheduledRewards[modId] || 0) + amount
    }
  }

  mockData.push(record)
  date.setDate(date.getDate() + 1)
}

console.log(mockData)
export { mockData }
