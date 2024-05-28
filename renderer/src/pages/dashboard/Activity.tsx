import ActivityLog from 'src/components/ActivityLog'
import useStationActivity from 'src/hooks/StationActivity'

const Activity = () => {
  const { activities, totalJobs } = useStationActivity()

  return (
    <section className='w-1/3 flex flex-col gap-8'>
      <div className='border border-grayscale-300'>
        <p>Total jobs completed</p>
        <p>{totalJobs.toLocaleString()}</p>
      </div>
      <div className='border border-grayscale-300'>
        <p>Activity</p>
        <ActivityLog activities={activities} />
      </div>
    </section>
  )
}

export default Activity
