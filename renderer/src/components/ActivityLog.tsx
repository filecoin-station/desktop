import { FC } from 'react'
import { ActivityEventMessage } from '../typings'
import * as dayjs from 'dayjs'

interface ILogElement {
  time: EpochTimeStamp,
  msg: string,
  type: 'info' | 'warning' | 'error' | undefined
}
const LogElement: FC<ILogElement> = (el) => {
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

interface IDateSeparator {
  date: string,
}

const DateSeparator: FC<IDateSeparator> = ({ date }) => {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const displayStr = date === today ? 'today' : date === yesterday ? 'yesterday' : dayjs(date).format("D MMM")
  
  return (
    <>
      <h1>{displayStr}</h1>
    </>
  )
}

interface IActivityLog {
  logStream: ActivityEventMessage[] | undefined;
}

const ActivityLog: FC<IActivityLog> = ({ logStream=[] }) => {
  const sortedLogStream = logStream.sort(function (x, y) {
    return x.time - y.time
  })

  const groups = sortedLogStream.reverse().reduce((groups: any, log: ActivityEventMessage) => {
    const date = dayjs.unix(log.time/1000).format("YYYY-MM-DD")
    return {...groups, [date]: groups[date] ? groups[date].concat(log) : [log] }
  }, {})

  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      activities: groups[date]
    }
  })
  
  return (
    <>
      <div className="mt-4 max-h-full overflow-y-auto ">
        {groupArrays.length > 0
          ? groupArrays.map((data: { date: string, activities: ActivityEventMessage[] | undefined }) => {
            return (
              <div key={data.date}>
                <div className='bg-red-300'><DateSeparator date={data.date}/></div>
                {data.activities?.map((element, index) => {
                  return <LogElement key={element.time} time={element.time} msg={element.msg} type={element.type} />
                })}
              </div>
            )
          })
          : <p>No activity to show</p>
        }
      </div>
    </>
  )
}

export default ActivityLog
