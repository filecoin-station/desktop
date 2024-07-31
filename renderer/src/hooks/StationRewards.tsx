import { useEffect, useMemo, useState } from 'react'
import { getScheduledRewards } from 'src/lib/station-config'
import useWallet from 'src/hooks/StationWallet'
import { formattedFilToBigInt } from 'src/lib/utils'

type ScheduledRewardsResponse = {
  day: string;
  scheduled_rewards: string;
}[]

async function getHistoricalScheduledRewards (address: string) {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
  const res = await fetch(
    `https://stats.filspark.com/participant/${address}/scheduled-rewards` +
      `?from=2024-01-01&to=${yesterday.toISOString().split('T')[0]}`
  )
  const stats = await res.json() as ScheduledRewardsResponse
  return stats.map(stat => ({
    timestamp: new Date(stat.day).toISOString(),
    totalScheduledRewards: {
      spark: BigInt(stat.scheduled_rewards),
      voyager: 0n
    }
  }))
}

type RewardTransfersResponse = {
  day: string;
  amount: string;
}[]

async function getHistoricalRewardTransfers (address: string) {
  const res = await fetch(
    `https://stats.filspark.com/participant/${address}/reward-transfers` +
      `?from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`
  )
  const stats = await res.json() as RewardTransfersResponse
  return stats.map(stat => ({
    timestamp: new Date(stat.day).toISOString(),
    totalRewardsReceived: {
      spark: BigInt(stat.amount),
      voyager: 0n
    }
  }))
}

async function getHistoricalRewardsData (address: string) {
  const [scheduledRewards, rewardTransfers] = await Promise.all([
    getHistoricalScheduledRewards(address),
    getHistoricalRewardTransfers(address)
  ])
  const stats = scheduledRewards.map(stat => ({
    ...stat,
    totalRewardsReceived: {
      spark: 0n,
      voyager: 0n
    }
  }))
  for (const stat of rewardTransfers) {
    const existingStat = stats.find(s => s.timestamp === stat.timestamp)
    if (existingStat) {
      existingStat.totalRewardsReceived = stat.totalRewardsReceived
    } else {
      stats.push({
        ...stat,
        totalScheduledRewards: {
          spark: 0n,
          voyager: 0n
        }
      })
    }
  }
  stats.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  let currentTotalSparkRewards = 0n
  for (const stat of stats) {
    currentTotalSparkRewards += stat.totalRewardsReceived.spark
    stat.totalRewardsReceived.spark = currentTotalSparkRewards
  }

  return stats
}

export type RewardsRecord = {
  timestamp: string;
  totalRewardsReceived: Record<string, bigint>;
  totalScheduledRewards: Record<string, bigint>;
}

export function sumAllRewards (data: RewardsRecord['totalRewardsReceived']) {
  return Object.values(data).reduce((acc, val) => acc + val, 0n)
}

const useStationRewards = () => {
  const wallet = useWallet()
  const [scheduledRewards, setScheduledRewards] = useState<bigint>()
  const [historicalRewards, setHistoricalRewards] = useState<RewardsRecord[]>([])

  const totalRewardsReceived = useMemo(
    () => sumAllRewards(historicalRewards.at(-1)?.totalRewardsReceived || {}),
    [historicalRewards]
  )

  useEffect(() => {
    async function loadStoredInfo () {
      if (!wallet.stationAddress0x || document.hidden) return
      setHistoricalRewards(
        await getHistoricalRewardsData(wallet.stationAddress0x)
      )
    }
    loadStoredInfo()
    const id = setInterval(loadStoredInfo, 20 * 60 * 1000)
    document.addEventListener('visibilitychange', loadStoredInfo)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', loadStoredInfo)
    }
  }, [wallet.stationAddress0x])

  useEffect(() => {
    async function loadStoredInfo () {
      if (document.hidden) return
      setScheduledRewards(formattedFilToBigInt(await getScheduledRewards()))
    }
    loadStoredInfo()
    const id = setInterval(() => loadStoredInfo(), 60 * 60 * 1000)
    document.addEventListener('visibilitychange', loadStoredInfo)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', loadStoredInfo)
    }
  }, [wallet.stationAddress0x])

  useEffect(() => {
    const unsubscribeOnScheduledRewardsUpdate = window.electron.stationEvents.onScheduledRewardsUpdate(balance => {
      setScheduledRewards(formattedFilToBigInt(balance))
    })
    return () => {
      unsubscribeOnScheduledRewardsUpdate()
    }
  }, [])

  const historicalRewardsWithLiveToday = useMemo(() => {
    const rewards = [...historicalRewards]
    let todayRewards = rewards[rewards.length - 1]
    if (
      !todayRewards ||
      new Date(todayRewards.timestamp).getDate() !== new Date().getDate() ||
      new Date(todayRewards.timestamp).getMonth() !== new Date().getMonth() ||
      new Date(todayRewards.timestamp).getFullYear() !== new Date().getFullYear()
    ) {
      todayRewards = {
        timestamp: new Date().toISOString(),
        totalRewardsReceived: {
          spark: rewards[rewards.length - 1]?.totalRewardsReceived.spark || 0n,
          voyager: 0n
        },
        totalScheduledRewards: {
          spark: 0n,
          voyager: 0n
        }
      }
      rewards.push(todayRewards)
    }
    todayRewards.totalScheduledRewards.spark = scheduledRewards
      ? BigInt(scheduledRewards)
      : 0n
    return rewards
  }, [historicalRewards, scheduledRewards])

  return {
    historicalRewards: historicalRewardsWithLiveToday,
    scheduledRewards,
    totalRewardsReceived
  }
}

export default useStationRewards
