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
import walletLight from './../assets/img/wallet-light.svg'
import video from './../assets/video/abstract.mp4'

type IFilWalletHeader = {
  address: string | undefined;
  disconnect: () => void;
}

const FilWalletHeader: FC<IFilWalletHeader> = ({ address, disconnect }) => {
  const shortAddr = address?.substring(0, 5) + '...' + address?.substring(address.length - 5, address.length)

  return (
    <>
      <img src={walletLight} width='16px' height='auto' className='mx-1' />
      <span className='text-right mx-1'>
        {shortAddr}
      </span>
      <button className='link-primary mx-1' onClick={disconnect}>
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
      addr && addr !== '' ? setFilAddress(addr) : navigate('/address', { replace: true })
    })
    getStationActivityLog().then(setActivityLog)
    getStationTotalEarnings().then(setTotalEarnigs)
    getStationTotalJobs().then(setTotalJobs)
  }

  const handleActivityLogEvent = useCallback((_event: any, value: ActivityEventMessage) => {
    setActivityLog(previousLog => { return previousLog ? [...previousLog, value] : [value] })
    setTotalEarnigs((previousCounter) => previousCounter ? previousCounter + 0.001 : 0.001)
    setTotalJobs((previousCounter) => previousCounter ? previousCounter + 1 : 1)
  }, [])

  const handleEarningsCounterEvent = useCallback((_event: any, value: number) => {
    setTotalEarnigs((previousCounter) => previousCounter ? previousCounter + value : value)
  }, [])

  const handleJobsCounterEvent = useCallback((_event: any, value: number) => {
    setTotalJobs((previousCounter) => previousCounter ? previousCounter + value : value)
  }, [])

  useEffect(() => {
    updateStatus()
    startSaturnNode()
    const unsubscribeActivityLog = window.electron.stationEvents.onActivityLog(handleActivityLogEvent)
    const unsubscribeEarningsCounter = window.electron.stationEvents.onEarningsCounter(handleEarningsCounterEvent)
    const unsubscribeJobsCounter = window.electron.stationEvents.onJobsCounter(handleJobsCounterEvent)

    return () => {
      stopSaturnNode()
      unsubscribeActivityLog()
      unsubscribeEarningsCounter()
      unsubscribeJobsCounter()
    }
  }, [])

  const disconnect = () => {
    stopSaturnNode().then(() => {
      setStationFilAddress('').then(() => { setFilAddress(''); navigate("/address") })
    })
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-grayscale-600 ">
      <div className='h-[33%] min-h-fit flex justify-center overflow-y-auto'>
        <video className='absolute z-0 w-auto min-w-full min-h-[33%] max-h-[33%] object-cover' autoPlay loop muted>
          <source src={video} type='video/mp4' />
        </video>
        <div className='absolute top-0 right-0 z-1 w-full h-full gradient-bg gradient-bg-2'></div>

        <div className="pt-10 pb-5 w-[80%] md:w-[60%] xl:w-[40%] flex flex-col justify-between z-20">
          <div className="flex justify-end">
            <FilWalletHeader address={filAddress} disconnect={disconnect} />
          </div>

          <div className=''>
            <StationStats totalJobs={totalJobs} totalEarns={totalEarnings} />
          </div>

        </div>
      </div>

      <div className='h-[67%] w-full flex justify-center bg-grayscale-200 z-20'>
        <div className="w-full pb-20 flex justify-center z-20">
          <ActivityLog logStream={activityLog} />
        </div>
      </div>
    </div>
  )
}
