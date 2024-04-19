import { useState, useEffect } from 'react'
import {
  getActivities,
  getScheduledRewards,
  getTotalJobsCompleted
} from 'src/lib/station-config'
import { Activity } from 'src/typings'

interface StationActivity {
  totalJobs: number;
  scheduledRewards: string | undefined;
  activities: Activity[] | [];
}
const useStationActivity = (): StationActivity => {
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [scheduledRewards, setScheduledRewards] = useState<string | undefined>()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const loadStoredInfo = async () => setActivities(await getActivities())
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const loadStoredInfo = async () => setTotalJobs(await getTotalJobsCompleted())
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const loadStoredInfo = async () => setScheduledRewards(await getScheduledRewards())
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const unsubscribeOnJobProcessed = window.electron.stationEvents.onJobProcessed(setTotalJobs)
    return () => {
      unsubscribeOnJobProcessed()
    }
  }, [])

  useEffect(() => {
    const unsubscribeOnActivityLogged = window.electron.stationEvents.onActivityLogged(activity => {
      setActivities(activities => {
        const updatedActivities = [activity, ...activities]
        updatedActivities.length = Math.min(updatedActivities.length, 100)
        return updatedActivities
      })
    })
    return () => {
      unsubscribeOnActivityLogged()
    }
  }, [])

  useEffect(() => {
    const unsubscribeOnScheduledRewardsUpdate = window.electron.stationEvents.onScheduledRewardsUpdate(balance => {
      setScheduledRewards(balance)
    })
    return () => {
      unsubscribeOnScheduledRewardsUpdate()
    }
  }, [])

  return { totalJobs, scheduledRewards, activities }
}

export default useStationActivity
