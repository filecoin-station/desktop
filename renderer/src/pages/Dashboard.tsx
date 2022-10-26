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
import UpdateBanner from '../components/UpdateBanner'
import SkeletonLoading from '../components/SkeletonLoading'

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate()

  const [address, setAddress] = useState<string | undefined>()
  const [totalJobs, setTotalJobs] = useState<number | undefined>(undefined)
  const [totalEarnings, setTotalEarnigs] = useState<number | undefined>(undefined)
  const [activities, setActivities] = useState<ActivityEventMessage[] | undefined>(undefined)
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

  useEffect(() => {
    const loadStoredInfo = async () => {
      Promise.all([
        (async () => { setAddress(await getFilAddress()) })(),
        (async () => { setActivities(await getAllActivities()) })(),
        (async () => { setTotalEarnigs(await getTotalEarnings()) })(),
        (async () => { setTotalJobs(await getTotalJobsCompleted()) })()
      ])
    }
    loadStoredInfo()

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
      <UpdateBanner />
      <div className="relative">
        <div className="max-w-[744px] mx-auto">
          <div className="absolute left-0 z-0 top-0 w-full h-[300px] bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${HeaderBackgroundImage})`,
              WebkitMaskImage: 'linear-gradient(black, transparent)',
              maskImage: 'linear-gradient(black, transparent)'
            }}>
          </div>
          <div className="h-[300px] flex flex-col relative z-10">
            <div className="flex-grow flex pt-4 justify-end justify-items-end">
              <div>
                {address === undefined
                  ? <div className="w-[230px]"><SkeletonLoading /></div>
                  : <button type="button" className="flex items-center cursor-pointer" title="logout" onClick={disconnect}>
                    <img src={WalletIcon} alt="" />
                    <span className="text-right mx-3 fil-address" title="fil address">{shortAddress(address)}</span>
                    <span className="underline text-primary">Change Wallet</span>
                  </button>
                }
              </div>
            </div>
            <div className="mb-6">
              <p className="w-fit text-body-3xs text-grayscale-700 uppercase">Total Jobs Completed</p>
              {totalJobs === undefined
                ? <div className="w-[160px] h-[66px] py-4"><SkeletonLoading /></div>
                : <p className="w-fit text-header-m font-bold font-number total-jobs" title="total jobs">{totalJobs}</p>
              }
            </div>
            <div className="mb-6">
              <p className="w-fit text-body-3xs text-grayscale-700 uppercase">Total Earnings (coming soon)</p>
              {totalEarnings === undefined
                ? <div className="w-[160px] h-[66px] py-4"><SkeletonLoading /></div>
                : <p className="w-fit text-header-m font-bold font-number total-earnings" title="total earnings">
                  {totalEarnings > 0 ? totalEarnings : '--'}
                  {totalEarnings > 0 ? <span className="text-header-3xs">FIL</span> : ''}
                </p>
              }
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
            {activities === undefined
              ? <>
                  <div className="w-full py-1"><SkeletonLoading /></div>
                  <div className="w-full py-1"><SkeletonLoading /></div>
                  <div className="w-full py-1"><SkeletonLoading /></div>
                  <div className="w-full py-1"><SkeletonLoading /></div>
                  <div className="w-full py-1"><SkeletonLoading /></div>
                </>
              : <ActivityLog activities={activities} />}
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
