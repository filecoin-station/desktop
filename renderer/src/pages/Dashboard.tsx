import { useState } from 'react'
import HeaderBackgroundImage from '../assets/img/header.png'
import Modal from '../components/Modal'
import ActivityLog from '../components/ActivityLog'
import UpdateBanner from '../components/UpdateBanner'
import WalletWidget from '../components/WalletWidget'
import useStationActivity from '../hooks/StationActivity'
import { formatTokenValue } from '../utils/number-ops'

const scheduledRewardsTooltip = `
This is the reward total you have accrued since your last payout.
Scheduled earnings will be sent to your Station Wallet approximately
once a month, provided you have earned more than the payout threshold.
`.trim().replace(/ *\r?\n */g, ' ')

const Dashboard = (): JSX.Element => {
  const { totalJobs, scheduledRewards, activities } = useStationActivity()
  const [walletCurtainIsOpen, setWalletCurtainIsOpen] = useState<boolean>(false)
  const toggleCurtain = () => setWalletCurtainIsOpen(!walletCurtainIsOpen)

  return (
    <div className="h-screen w-screen overflow-hidden bg-grayscale-100">
      <UpdateBanner />
      <div className=''>
        <Modal isOpen={walletCurtainIsOpen} setIsOpen={toggleCurtain} />
      </div>
      <div className="relative">
        <div className="max-w-[744px] mx-auto">
          <div
            className="absolute left-0 z-0 top-0 w-full h-[300px] bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${HeaderBackgroundImage})`,
              WebkitMaskImage: 'linear-gradient(black, transparent)',
              maskImage: 'linear-gradient(black, transparent)'
            }}
          >
          </div>
          <div className="h-[300px] flex flex-col relative z-20">
            <div className="flex-grow flex pt-4 justify-end justify-items-end">
              <WalletWidget onClick={toggleCurtain} />
            </div>
            <div className="mb-6">
              <p className="w-fit text-body-3xs text-grayscale-700 uppercase">Total Jobs Completed</p>
              <p className="w-fit text-header-m font-bold font-number total-jobs" title="total jobs">
                {totalJobs.toLocaleString()}
              </p>
            </div>
            <div className="mb-6">
              <p className="w-fit text-body-3xs text-grayscale-700 uppercase">Scheduled rewards</p>
              <p
                className="w-fit text-header-m font-bold font-number total-earnings"
                title={scheduledRewardsTooltip}
              >
                {formatTokenValue(scheduledRewards)}<span className="text-header-3xs">&nbsp;FIL</span>
              </p>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute h-14 bg-grayscale-100 w-full z-20"
          style={{
            WebkitMaskImage: 'linear-gradient(black, transparent)',
            maskImage: 'linear-gradient(black, transparent)'
          }}
        >
        </div>
        <div tabIndex={0} className="h-[calc(100vh_-_300px)] overflow-y-auto pt-12 relative z-10">
          <div className="max-w-[744px] mx-auto overflow-hidden">
            <ActivityLog activities={activities} />
          </div>
        </div>
        <div
          className="pointer-events-none fixed h-14 bg-grayscale-100 w-full z-10 bottom-0"
          style={{
            WebkitMaskImage: 'linear-gradient(transparent, black)',
            maskImage: 'linear-gradient(transparent, black)'
          }}
        >
        </div>
      </div>
    </div>
  )
}

export default Dashboard
