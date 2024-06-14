import { useEffect, useMemo, useState } from 'react'
import { getScheduledRewards } from 'src/lib/station-config'
import useWallet from 'src/hooks/StationWallet'

type StatsResponse = {
  day: string;
  scheduled_rewards: string;
}[]

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

async function getHistoricalRewardsData (address: string) {
  const to = new Date()
  const from = new Date(new Date().setDate(to.getDate() - 100))
  const res = await fetch(
    'https://stats.filspark.com/participants/scheduled-rewards/daily' +
      `?address=${address}&from=${formatDate(from)}&to=${formatDate(to)}`
  )
  const stats = await res.json() as StatsResponse
  return stats.map(stat => ({
    timestamp: new Date(stat.day).toISOString(),
    totalRewardsReceived: {
      spark: 0,
      voyager: 0
    },
    totalScheduledRewards: {
      spark: Number(
        (BigInt(stat.scheduled_rewards) / 1_000_000_000_000_000_000n)
          .toString()
      ),
      voyager: 0
    }
  }))
}

export type RewardsRecord = {
  timestamp: string;
  totalRewardsReceived: Record<string, number>;
  totalScheduledRewards: Record<string, number>;
}

export function sumAllRewards (data: RewardsRecord['totalRewardsReceived']) {
  return Object.values(data).reduce((acc, val) => acc + val, 0)
}

const useStationRewards = () => {
  const wallet = useWallet()
  const [scheduledRewards, setScheduledRewards] = useState<string>()
  const [historicalRewards, setHistoricalRewards] = useState<RewardsRecord[]>([])

  const totalRewardsReceived = useMemo(
    () => sumAllRewards(historicalRewards.at(-1)?.totalRewardsReceived || {}),
    [historicalRewards]
  )

  useEffect(() => {
    async function loadStoredInfo () {
      if (wallet.stationAddress0x) {
        setHistoricalRewards(
          await getHistoricalRewardsData(wallet.stationAddress0x)
        )
      }
      setScheduledRewards(await getScheduledRewards())
    }
    loadStoredInfo()
  }, [wallet.stationAddress0x])

  useEffect(() => {
    const unsubscribeOnScheduledRewardsUpdate = window.electron.stationEvents.onScheduledRewardsUpdate(balance => {
      setScheduledRewards(balance)
    })
    return () => {
      unsubscribeOnScheduledRewardsUpdate()
    }
  }, [])

  return {
    historicalRewards,
    scheduledRewards,
    totalRewardsReceived
  }
}

export default useStationRewards
