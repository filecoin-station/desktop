import { useEffect, useState, useCallback, FC } from 'react'
import {
  getStationActivityLog, stopSaturnNode, setStationFilAddress,
  startSaturnNode, getStationFilAddress, getStationTotalEarnings,
  getStationTotalJobs
} from '../components/InterfaceCalls'
import { ActivityEventMessage } from '../typings'
import ActivityLog from '../components/ActivityLog'
import StationStats from '../components/DashboardStats'
import { useNavigate } from 'react-router-dom'

type IFilWalletHeader = {
  address: string | undefined;
  disconnect: () => void;
}

const FilWalletHeader: FC<IFilWalletHeader> = ({ address, disconnect }) => {
  const shortAddr = address?.substring(0, 4) + '...' + address?.substring(address.length - 4, address.length)

  return (
    <>
      <span className='text-white text-right'>
        {shortAddr}
      </span>
      <button className='text-white ml-4' onClick={disconnect}>
        change
      </button>
    </>
  )
}

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

  const handleActivityLogEvent = useCallback((_event: any, value: ActivityEventMessage) => {
    setActivityLog(previousLog => { return previousLog ? [...previousLog, value] : [value] })
  }, []);

  const handleEarningsCounterEvent = useCallback((_event: any, value: number) => {
    setTotalEarnigs((previousCounter) => previousCounter ? previousCounter + value : value)
  }, []);

  const handleJobsCounterEvent = useCallback((_event: any, value: number) => {
    setTotalJobs((previousCounter) => previousCounter ? previousCounter + value : value)
  }, []);


  useEffect(() => {
    updateStatus()
    startSaturnNode()
    const unsubscribeActivityLog = window.electron.onActivityLog(handleActivityLogEvent)
    const unsubscribeEarningsCounter = window.electron.onEarningsCounter(handleEarningsCounterEvent)
    const unsubscribeJobsCounter = window.electron.onJobsCounter(handleJobsCounterEvent)

    return () => {
      stopSaturnNode();
      unsubscribeActivityLog();
      unsubscribeEarningsCounter();
      unsubscribeJobsCounter();
    }
  }, [])


  const disconnect = () => {
    stopSaturnNode().then(() => {
      setStationFilAddress('').then(() => { setFilAddress(''); })
    })
  }


  return (
    <div className="h-screen w-screen overflow-hidden">

      <div className='h-[33%] flex justify-center bg-slate-900'>
        <div className="relative mt-10 mb-10 w-[80%] md:w-[60%] xl:w-[40%]">

          <div className="flex justify-end">
            <FilWalletHeader address={filAddress} disconnect={disconnect} />
          </div>

          <div className='h-full flex flex-row items-end pb-10'>
            <StationStats totalJobs={totalJobs} totalEarns={totalEarnings} />
          </div>

        </div>
      </div>

      <div className='h-[67%] flex justify-center bg-[#f1f4f5]'>
        <div className="w-[80%] md:w-[60%] xl:w-[40%] mt-10 pb-20 relative">
          <h1 className='text-xl font-bold'>Activity log</h1>
          <ActivityLog logStream={activityLog} />
        </div>
      </div>
    </div>
  )
}

