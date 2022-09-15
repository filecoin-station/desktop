import React, { useEffect, useState } from 'react'
import { Activity } from '../../../main/typings'

export const ActivityLog : React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    (async () => {
      const newActivities = await window.electron.getAllActivities()
      setActivities(newActivities)
    })()
  }, [])

  useEffect(() => {
    const unsubscribe = window.electron.onActivityLogged(allActivities => {
      setActivities(allActivities)
    })
    return unsubscribe
  }, [])

  // TODO: add proper CSS styling :)
  const style: React.CSSProperties = {
    listStyle: 'none',
    textAlign: 'left',
    fontSize: '1rem',
    fontFamily: 'monospace',
    border: '1px solid white',
    padding: '1em'
  }

  return <>
    <h3>Activity Log</h3>
    <ul style={style}>
      {activities.map(activity => <li key={activity.id}>{activity.message}</li>).reverse()}
    </ul>
  </>
}
