import React, { useEffect, useState } from 'react'

export const TotalJobsCompleted : React.FC = () => {
  const [totalJobsCompleted, setTotalJobsCompleted] = useState<number>(0)

  useEffect(() => {
    (async () => {
      const jobsCompleted = await window.electron.getTotalJobsCompleted()
      setTotalJobsCompleted(jobsCompleted)
    })()
  }, [])

  useEffect(() => {
    const unsubscribe = window.electron.onJobStatsUpdated(count => {
      setTotalJobsCompleted(count)
    })
    return unsubscribe
  }, [])

  // TODO: add proper CSS styling :)
  const style: React.CSSProperties = {
    marginLeft: '2em',
    fontSize: '2em',
    fontFamily: 'monospace'
  }

  return <>
    <h3>Total jobs completed</h3>
    <p style={style}>{totalJobsCompleted}</p>
  </>
}
