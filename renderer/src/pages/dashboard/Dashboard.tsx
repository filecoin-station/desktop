import BorderedBox from 'src/components/BorderedBox'
import ActivityInfo from './ActivityInfo'

const Dashboard = (): JSX.Element => {
  return (
    <main className='flex items-start gap-5 px-9 mt-28 flex-1'>
      <BorderedBox className='flex-1'>
        chart
      </BorderedBox>
      <ActivityInfo />
    </main>
  )
}

export default Dashboard
