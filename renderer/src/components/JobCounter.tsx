import React, { useEffect, useState } from 'react'

export const JobCounter : React.FC = () => {
  const [totalJobCount, setTotalJobCount] = useState<number>(0)

  useEffect(() => {
    (async () => {
      const count = await window.electron.getJobCount()
      setTotalJobCount(count)
    })()
  }, [])

  useEffect(() => {
    const unsubscribe = window.electron.onJobCountUpdated(count => {
      setTotalJobCount(count)
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
    <p style={style}>{totalJobCount}</p>
  </>
}
