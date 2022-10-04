import { useEffect, useState } from 'react'
import {
  getAllActivities, stopSaturnNode,
  setFilAddress, getFilAddress,
  getTotalEarnings, getTotalJobsCompleted
} from '../lib/station-config'
import { ActivityEventMessage } from '../typings'
import ActivityLog from '../components/ActivityLog'
import HeaderBackgroundImage from '../assets/img/header.png'
import WalletIcon from '../assets/img/wallet.svg'
import { useNavigate } from 'react-router-dom'
import { confirmChangeWalletAddress } from '../lib/dialogs'

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate()

  const [address, setAddress] = useState<string | undefined>()
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [totalEarnings, setTotalEarnigs] = useState<number>(0)
  const [activities, setActivities] = useState<ActivityEventMessage[]>([])
  const shortAddress = (str: string) => str
    ? str.substring(0, 4) + '...' + str.substring(str.length - 4, str.length)
    : ''
  const disconnect = async () => {
    if (!(await confirmChangeWalletAddress())) return
    await stopSaturnNode()
    await setFilAddress('')
    setAddress(undefined)
    navigate('/wallet', { replace: true })
  }

  const reload = async (): Promise<void> => {
    setAddress(await getFilAddress())
    setActivities(await getAllActivities())
    setTotalEarnigs(await getTotalEarnings())
    setTotalJobs(await getTotalJobsCompleted())
  }

  useEffect(() => { reload() })

  useEffect(() => {
    const unsubscribeOnActivityLogged = window.electron.stationEvents.onActivityLogged(setActivities)
    const unsubscribeOnEarningsChanged = window.electron.stationEvents.onEarningsChanged(setTotalEarnigs)
    const unsubscribeOnJobProcessed = window.electron.stationEvents.onJobProcessed(setTotalJobs)

    return () => {
      unsubscribeOnActivityLogged()
      unsubscribeOnEarningsChanged()
      unsubscribeOnJobProcessed()
    }
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden bg-grayscale-100">
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
                <button type="button" className="flex items-center cursor-pointer" title="logout" onClick={disconnect}>
                  <img src={WalletIcon} alt=""/>
                  <span className="text-right mx-3 fil-address" title="fil address">{address && shortAddress(address)}</span>
                  <span className="underline text-primary">Change Wallet</span>
                </button>
              </div>
            </div>
            <div className="mb-6">
              <p className="w-fit text-body-3xs text-grayscale-700 uppercase">Total Jobs Completed</p>
              <p className="w-fit text-header-m font-bold font-number total-jobs" title="total jobs">{totalJobs}</p>
            </div>
            <div className="mb-6">
              <p className="w-fit text-body-3xs text-grayscale-700 uppercase">Total Earnings (updated daily)</p>
              <p className="w-fit text-header-m font-bold font-number total-earnings" title="total earnings">
                {totalEarnings > 0 ? totalEarnings : '--'}
                {totalEarnings > 0 ? <span className="text-header-3xs">FIL</span> : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute h-14 bg-grayscale-100 w-full z-20"
          style={{
            WebkitMaskImage: 'linear-gradient(black, transparent)',
            maskImage: 'linear-gradient(black, transparent)'
          }}>
        </div>
        <div tabIndex={0} className="h-[calc(100vh_-_300px)] overflow-y-auto pt-12 relative z-10">
          <div className="max-w-[744px] mx-auto overflow-hidden">
            <ActivityLog activities={activities} />
          </div>
        </div>
        <div className="pointer-events-none fixed h-14 bg-grayscale-100 w-full z-10 bottom-0"
          style={{
            WebkitMaskImage: 'linear-gradient(transparent, black)',
            maskImage: 'linear-gradient(transparent, black)'
          }}>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
