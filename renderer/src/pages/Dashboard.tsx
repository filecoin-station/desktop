import { useEffect, useState, useCallback } from 'react'
import { getStationActivityLog, stopSaturnNode, setStationFilAddress,
         startSaturnNode, getStationFilAddress, getStationTotalEarnings,
         getStationTotalJobs } from '../components/InterfaceCalls'
import { ActivityEventMessage } from '../typings'
import StationActivityLog from '../components/StationActivityLog'
import StationStats from '../components/StationStats'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate()
  const [filAddress, setFilAddress] = useState<string | undefined>()
  const [totalJobs, setTotalJobs] = useState<number | undefined>()
  const [totalEarnings, setTotalEarnigs] = useState<number | undefined>()
  const [activityLog, setActivityLog] = useState<ActivityEventMessage[]>()


  const updateStatus = (): void => {
    getStationFilAddress().then((addr) => {
      addr && addr !== '' ? setFilAddress(addr) : navigate("/address", { replace: true })
    })
    getStationActivityLog().then(setActivityLog)
    getStationTotalEarnings().then(setTotalEarnigs)
    getStationTotalJobs().then(setTotalJobs)
  }

  const handleActivityLogEvent = useCallback((event: Event) => {
    event.preventDefault()
    const customEvent = event as CustomEvent
    setActivityLog(previousLog => { return previousLog ? [...previousLog, customEvent.detail] : [customEvent.detail] })
  }, []);

  const handleEarningsCounterEvent = useCallback((event: Event) => {
    event.preventDefault()
    const customEvent = event as CustomEvent
    setTotalEarnigs((previousCounter) => previousCounter + customEvent.detail.amount)
  }, []);

  const handleJobsCounterEvent = useCallback((event: Event) => {
    event.preventDefault()
    const customEvent = event as CustomEvent
    setTotalJobs((previousCounter) => previousCounter + customEvent.detail.count)
  }, []);

  const startMessaging = () => {
    const msgActivityLog = { time: Date.now(), msg: "New Job started", type: "Info" }
    const customEventActivityLog = new CustomEvent('activityLog', { detail: msgActivityLog });
    document.dispatchEvent(customEventActivityLog);

    const msgEarningsCounter = { time: Date.now(), amount: Math.floor(Math.random() * 20) }
    const customEventEarningsCounter = new CustomEvent('earningsCounter', { detail: msgEarningsCounter });
    document.dispatchEvent(customEventEarningsCounter);

    const msgJobsCounter = { time: Date.now(), count: Math.floor(Math.random() * 3) }
    const customEventmsgJobsCounter = new CustomEvent('jobsCounter', { detail: msgJobsCounter });
    document.dispatchEvent(customEventmsgJobsCounter);
    setTimeout(() => { startMessaging() }, 5000)
  }


  useEffect(() => {
    updateStatus()
    startSaturnNode()
    document.addEventListener('activityLog', handleActivityLogEvent);
    document.addEventListener('earningsCounter', handleEarningsCounterEvent);
    document.addEventListener('jobsCounter', handleJobsCounterEvent);
    startMessaging()
    return () => {
      stopSaturnNode();
      document.removeEventListener("activityLog", handleActivityLogEvent)
      document.removeEventListener('earningsCounter', handleEarningsCounterEvent);
      document.removeEventListener('jobsCounter', handleJobsCounterEvent);
    }
  }, [])


  const disconnect = () => {
    stopSaturnNode().then(() => {
      setStationFilAddress('').then(() => { setFilAddress(''); })
    })
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className='h-[33%] flex justify-center bg-slate-900 '>
        <StationStats filAddress={filAddress} disconnect={disconnect} totalJobs={totalJobs} totalEarns={totalEarnings} />
      </div>
      <div className='h-[67%] flex justify-center bg-[#f1f4f5]'>
        <StationActivityLog logStream={activityLog} />
      </div> 
    </div>
  )
}


