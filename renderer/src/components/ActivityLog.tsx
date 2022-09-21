import { FC } from 'react'
import { ActivityEventMessage } from '../typings'
import * as dayjs from 'dayjs'

const ActivityLogItem: FC<ActivityEventMessage> = (el) => {
  const time = new Intl.DateTimeFormat(window.navigator.language, {
    hour: 'numeric', minute: 'numeric', second: 'numeric'
  }).format(new Date(el.time))

  return (
    <div className="grid grid-cols-[25%_5%_70%]">
      <div className=''>
        <span className='text-black'>{time}</span>
      </div>
      <div className=''>
      </div>
      <div className=''>
        <p>{el.msg}</p>
      </div>
    </div>
  )
}

interface DateSeparatorProps {
  date: string,
}

const DateSeparator: FC<DateSeparatorProps> = ({ date }) => {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const displayStr = date === today ? 'today' : date === yesterday ? 'yesterday' : dayjs(date).format('D MMM')

  return <h1>{displayStr}</h1>
}

interface ActivitiesByDate {
  [date: string]: ActivityEventMessage[];
}

// TODO: remove examples
const initialActivities: ActivityEventMessage[] = [
  { time: dayjs().unix(), msg: 'this just happened', type: 'info' },
  { time: dayjs().subtract(1, 'day').unix(), msg: 'dis from yesterday', type: 'info' },
  { time: dayjs().subtract(2, 'day').unix(), msg: '2 days ago', type: 'info' },
  { time: dayjs().subtract(2, 'day').unix(), msg: '2 days ago too', type: 'info' }
]
interface ActivityLogProps {
  activities: ActivityEventMessage[];
}

const ActivityLog: FC<ActivityLogProps> = ({ activities = initialActivities }) => {
  const activitiesByDate: ActivitiesByDate =
    activities
      .sort((x, y) => y.time - x.time)
      .reduce((groups: ActivitiesByDate, activity: ActivityEventMessage) => {
        const date = dayjs.unix(activity.time).format('YYYY-MM-DD')
        return { ...groups, [date]: groups[date] ? groups[date].concat(activity) : [activity] }
      }, {})

  return (
    <div className="overflow-y-auto">
      {Object.keys(activitiesByDate).map((date) => (
        <div key={date}>
          <div className='bg-red-300'>
            <DateSeparator date={date}/>
          </div>
          <div>
            {activitiesByDate[date].map((activity) => <ActivityLogItem {...activity} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityLog
