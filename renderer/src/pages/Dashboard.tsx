import { useEffect, useState, useCallback } from 'react'
import {
  getStationActivityLog, stopSaturnNode, setStationFilAddress,
  startSaturnNode, getStationFilAddress, getStationTotalEarnings,
  getStationTotalJobs
} from '../components/InterfaceCalls'
import { ActivityEventMessage } from '../typings'
import ActivityLog from '../components/ActivityLog'
import HeaderBackgroundImage from '../assets/img/header.png'
import WalletIcon from '../assets/img/wallet.svg'

export default function Dashboard (): JSX.Element {
  const [address, setAddress] = useState<string | undefined>()
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [totalEarnings, setTotalEarnigs] = useState<number>(0)
  const [activities, setActivities] = useState<ActivityEventMessage[]>([])
  const shortAddress = (str: string | undefined) => str
    ? str.substring(0, 4) + '...' + str.substring(str.length - 4, str.length)
    : ''
  const disconnect = async () => {
    // TODO: move disconnect logic to backend
    await stopSaturnNode()
    await setStationFilAddress('')
    setAddress('')
  }

  const reload = async (): Promise<void> => {
    setAddress(await getStationFilAddress())
    setActivities(await getStationActivityLog())
    setTotalEarnigs(await getStationTotalEarnings())
    setTotalJobs(await getStationTotalJobs())
  }

  const handleActivity = useCallback((value: ActivityEventMessage) => {
    setActivities(activities => activities ? [...activities, value] : [value])
  }, [])

  const handleEarnings = useCallback((value: number) => {
    setTotalEarnigs((counter) => counter ? counter + value : value)
  }, [])

  const handleJobs = useCallback((value: number) => {
    setTotalJobs((counter) => counter ? counter + value : value)
  }, [])

  useEffect(() => {
    reload()
    startSaturnNode()
    const unsubscribeOnActivityLogged = window.electron.stationEvents.onActivityLogged(handleActivity)
    const unsubscribeOnEarningsChanged = window.electron.stationEvents.onEarningsChanged(handleEarnings)
    const unsubscribeOnJobProcessed = window.electron.stationEvents.onJobProcessed(handleJobs)

    return () => {
      stopSaturnNode()
      unsubscribeOnActivityLogged()
      unsubscribeOnEarningsChanged()
      unsubscribeOnJobProcessed()
    }
  }, [handleActivity, handleEarnings, handleJobs])

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f0f0f0]">
      <div className="relative">

        <div className="max-w-[744px] mx-auto">
          <div className="absolute left-0 z-0 top-0 w-full h-[300px]"
            style={{
              backgroundImage: `url(${HeaderBackgroundImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 0',
              WebkitMaskImage: 'linear-gradient(black, transparent)',
              maskImage: 'linear-gradient(black, transparent)'
            }}>
          </div>
          <div className="h-[300px] flex flex-col relative z-10">
            <div className="flex-grow flex pt-4 justify-end justify-items-end">
              <div>
                <a className="flex content-center cursor-pointer" href="/#" onClick={disconnect}>
                  <img src={WalletIcon} alt=""/>
                  <span className="text-right mx-3">{shortAddress(address)}</span>
                  <span className="underline text-primary">Change Wallet</span>
                </a>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[10px] uppercase">Total Jobs Completed</p>
              <p className="text-[44px] font-bold">{totalJobs}</p>
            </div>
            <div className="mb-6">
              <p className="text-[10px] uppercase">Total Earnings (updated daily)</p>
              <p className="text-[44px] font-bold">
                {totalEarnings}
                {totalEarnings && <span className="text-[20px]">FIL</span>}
              </p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none fixed h-[60px] bg-[#f0f0f0] w-full z-20"
          style={{
            WebkitMaskImage: 'linear-gradient(black, transparent)',
            maskImage: 'linear-gradient(black, transparent)'
          }}>
        </div>
        <div className="h-screen overflow-y-auto pt-12 relative z-10">
          <div className="max-w-[744px] mx-auto overflow-hidden">
            <ActivityLog activities={activities} />
          </div>
        </div>
        <div className="pointer-events-none fixed h-[60px] bg-[#f0f0f0] w-full z-10 bottom-0"
          style={{
            WebkitMaskImage: 'linear-gradient(transparent, black)',
            maskImage: 'linear-gradient(transparent, black)'
          }}>
        </div>
      </div>
    </div>
  )
}
