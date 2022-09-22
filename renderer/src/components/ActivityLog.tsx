import { FC } from 'react'
import { ActivityEventMessage } from '../typings'
import * as dayjs from 'dayjs'

const ActivityLogItem: FC<ActivityEventMessage> = (activity) => {
  const time = new Intl.DateTimeFormat(window.navigator.language, {
    hour: 'numeric', minute: 'numeric', second: 'numeric'
  }).format(new Date(activity.timestamp))

  return (
    <div className="flex py-4 border-b-[1px] border-[#00000006]">
      <div className="w-[40px]"></div>
      <div className="flex-1 mr-4">
        <p>{activity.message}</p>
      </div>
      <div className="">
        <span className='text-black'>{time}</span>
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

  return <div className="uppercase text-[10px] mb-4">{displayStr}</div>
}

interface ActivitiesByDate {
  [date: string]: ActivityEventMessage[];
}
interface ActivityLogProps {
  activities: ActivityEventMessage[];
}

const ActivityLog: FC<ActivityLogProps> = ({ activities = [] }) => {
  const activitiesByDate: ActivitiesByDate =
    activities
      .sort((x, y) => y.timestamp - x.timestamp)
      .reduce((groups: ActivitiesByDate, activity: ActivityEventMessage) => {
        const date = dayjs.unix(activity.timestamp).format('YYYY-MM-DD')
        return { ...groups, [date]: groups[date] ? groups[date].concat(activity) : [activity] }
      }, {})

  return (
    <div>
      {Object.keys(activitiesByDate).map((date) => (
        <div key={date} className="mb-12">
          <DateSeparator date={date}/>
          <div>
            {activitiesByDate[date].map((activity) => <ActivityLogItem key={activity.id} {...activity} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityLog
