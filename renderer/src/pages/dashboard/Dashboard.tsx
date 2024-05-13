import useStationRewards from 'src/hooks/StationRewards'
import { formatFilValue } from 'src/lib/utils'
import Chart from 'src/pages/dashboard/Chart'
import Activity from 'src/pages/dashboard/Activity'

const Dashboard = (): JSX.Element => {
  const { historicalRewards, totalRewardsReceived, scheduledRewards } = useStationRewards()

  return (
    <div className='flex gap-8'>
      <section className='w-2/3 border border-grayscale-300'>
        <div className='flex flex-wrap justify-between'>
          <div>
            <p>Total rewards received</p>
            <p>{totalRewardsReceived} FIL</p>
          </div>
          <div>
            <p>Next payout</p>
            <p>{formatFilValue(scheduledRewards)} FIL</p>
          </div>
          <div className='w-full my-4'>
            <Chart historicalRewards={historicalRewards} />
          </div>
        </div>
      </section>
      <Activity />
    </div>
  )
}

export default Dashboard
