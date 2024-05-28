import { useEffect, useMemo, useState } from 'react'
import { getScheduledRewards } from 'src/lib/station-config'
import { sumAllRewards } from 'src/lib/utils'
import { mockData } from 'src/pages/dashboard/mockData'

async function getHistoricalRewardsData () {
  return mockData
}

export type RewardsRecord = {
  timestamp: string;
  totalRewardsReceived: Record<string, number>;
  totalScheduledRewards: Record<string, number>;
}

const useStationRewards = () => {
  const [scheduledRewards, setScheduledRewards] = useState<string>()
  const [historicalRewards, setHistoricalRewards] = useState<RewardsRecord[]>([])

  const totalRewardsReceived = useMemo(
    () => sumAllRewards(historicalRewards.at(-1)?.totalRewardsReceived || {}),
    [historicalRewards]
  )

  useEffect(() => {
    async function loadStoredInfo () {
      setHistoricalRewards(await getHistoricalRewardsData())
      setScheduledRewards(await getScheduledRewards())
    }
    loadStoredInfo()
  }, [])

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
