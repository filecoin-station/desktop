import { useState, useEffect } from 'react'
import { getTotalEarnings, getActivities } from '../lib/station-config'
import { Activity } from '../typings'

interface StationActivity {
  totalJobs: number;
  totalEarnings: number;
  activities: Activity[] | [];
}
const useStationActivity = (): StationActivity => {
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [activities, setActivities] = useState<Activity[]>([])
  const [totalEarnings, setTotalEarnigs] = useState<number>(0)

  useEffect(() => {
    const loadStoredInfo = async () => setActivities(await getActivities())
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
    const unsubscribeOnEarningsChanged = window.electron.stationEvents.onEarningsChanged(setTotalEarnigs)
    return () => {
      unsubscribeOnEarningsChanged()
    }
  }, [])

  return { totalJobs, totalEarnings, activities }
}

export default useStationActivity
