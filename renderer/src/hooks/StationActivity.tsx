import { useState, useEffect } from 'react'
import { getTotalJobsCompleted, getAllActivities, getTotalEarnings } from '../lib/station-config'
import { ActivityEventMessage } from '../typings'

interface StationActivity {
  totalJobs: number,
  totalEarnings: number,
  activities: ActivityEventMessage[] | []
}
const useStationActivity = (): StationActivity => {
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [activities, setActivities] = useState<ActivityEventMessage[]>([])
  const [totalEarnings, setTotalEarnigs] = useState<number>(0)

  useEffect(() => {
    const loadStoredInfo = async () => setTotalJobs(await getTotalJobsCompleted())
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const loadStoredInfo = async () => setActivities(await getAllActivities())
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const loadStoredInfo = async () => setTotalEarnigs(await getTotalEarnings())
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const unsubscribeOnJobProcessed = window.electron.stationEvents.onJobProcessed(setTotalJobs)
    return () => {
      unsubscribeOnJobProcessed()
    }
  }, [])

  useEffect(() => {
    const unsubscribeOnActivityLogged = window.electron.stationEvents.onActivityLogged(setActivities)
    return () => {
      unsubscribeOnActivityLogged()
    }
  }, [])

  useEffect(() => {
    const unsubscribeOnEarningsChanged = window.electron.stationEvents.onEarningsChanged(setTotalEarnigs)
    return () => {
      unsubscribeOnEarningsChanged()
    }
  }, [])

  return { totalJobs, totalEarnings, activities }
}

export default useStationActivity
