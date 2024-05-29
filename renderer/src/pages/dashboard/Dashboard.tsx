import BorderedBox from 'src/components/BorderedBox'
import ActivityInfo from './ActivityInfo'
import ChartController from './ChartController'
import useStationRewards from 'src/hooks/StationRewards'

const Dashboard = (): JSX.Element => {
  const { historicalRewards } = useStationRewards()

  return (
    <main className='flex items-start gap-5 px-9 mt-28 flex-1'>
      <BorderedBox className='flex-1'>
        <ChartController historicalRewards={historicalRewards} />
      </BorderedBox>
      <ActivityInfo />
    </main>
  )
}

export default Dashboard
