import BorderedBox from 'src/components/BorderedBox'
import ActivityInfo from './ActivityInfo'
import ChartController from './ChartController'
import useStationRewards from 'src/hooks/StationRewards'
import RewardsInfo from './RewardsInfo'

const Dashboard = (): JSX.Element => {
  const { historicalRewards, totalRewardsReceived, scheduledRewards } = useStationRewards()

  return (
    <main className='flex items-start gap-5 px-9 mt-28 flex-1'>
      <BorderedBox className='flex-1'>
        <RewardsInfo totalRewardsReceived={totalRewardsReceived} scheduledRewards={scheduledRewards} />
        <ChartController historicalRewards={historicalRewards} />
      </BorderedBox>
      <ActivityInfo />
    </main>
  )
}

export default Dashboard
