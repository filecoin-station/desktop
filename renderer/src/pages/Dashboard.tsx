import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isSaturnNodeRunning, getSaturnNodeWebUrl, getSaturnNodeLog, stopSaturnNode, setStationFilAddress, startSaturnNode, getStationFilAddress } from '../components/InterfaceCalls'
import StationActivityLog from '../components/StationActivityLog'
import StationStats from '../components/StationStats'

export default function Dashboard(): JSX.Element {
  const [isRunning, setIsRunning] = useState(true)
  const [saturnNodeWebUrl, setSaturnNodeWebUrl] = useState('')
  const [saturnNodeLog, setSaturnNodeLog] = useState<{time: EpochTimeStamp, msg: string}[]|undefined>()
  const [filAddress, setFilAddress] = useState<string | undefined>()
  const [totalJobs, setTotalJobs] = useState<number | undefined>()
  const [totalEarnings, setTotalEarnigs] = useState<number | undefined>()

  const appendLog = (logMsg:string) => {
    if(saturnNodeLog) {
      setSaturnNodeLog([...saturnNodeLog, {time: Date.now(), msg: logMsg}])
    } else {
      setSaturnNodeLog([{time: Date.now(), msg: logMsg}])
    }
    
  }

  const updateStatus = (): void => {
    
    getStationFilAddress().then(setFilAddress)
    isSaturnNodeRunning().then(setIsRunning)
    getSaturnNodeWebUrl().then(setSaturnNodeWebUrl)
    getSaturnNodeLog().then((res) => {
      appendLog(res)
    })
    // `useEffect` and `setInterval` do not support async functions.
    // We are running the update in background and not waiting for the promises to resolve.
  }

  useEffect(() => {
    updateStatus()
    startSaturnNode()
    const id = setInterval(updateStatus, 1000)
    return () => clearInterval(id)
  }, [])


  const disconnect = () => {
    stopSaturnNode().then(() => {
      setStationFilAddress('').then(() => { setFilAddress(''); })
    })
  }

  const content = isRunning
    ? saturnNodeWebUrl &&
    <>
      <div className='h-[33%] flex justify-center bg-slate-900 '>
        <StationStats filAddress={filAddress} disconnect={disconnect} totalJobs={totalJobs} totalEarns={totalEarnings} />
      </div>
      <div className='h-[67%] flex justify-center bg-[#f1f4f5]'>
        <StationActivityLog logStream={saturnNodeLog} />
      </div>
    </>
    : !filAddress
    && <Navigate to="/address" replace />


  return (
    <div className="h-screen w-screen overflow-hidden">
      {content}
    </div>
  )
}


