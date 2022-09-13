import { FC } from 'react'
import { ActivityEventMessage } from '../typings'
import * as dayjs from 'dayjs'
import databaseIcon from './../assets/img/data--base.svg'


interface ILogElement {
  time: EpochTimeStamp,
  msg: string,
  type: 'info' | 'warning' | 'error' | undefined
}
const LogElement: FC<ILogElement> = (el) => {
  const time = new Intl.DateTimeFormat(window.navigator.language, {
    hour: 'numeric', minute: 'numeric'
  }).format(new Date(el.time))

  return (
    <div className="grid grid-cols-[5%_70%_25%] py-2 border-b border-grayscale-400
    text-body-xl leading-[20px] tracking-0 items-center">
      <img src={databaseIcon} className="text-primary fill-primary stroke-primary" width='16px' height='auto' className='mx-1' />
      <p className=''>{el.msg}</p>
      <span className='text-black opacity-60 justify-self-end'>{time}</span>
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
    <div className="pt-8">
      <h1 className='text-body text-body-m opacity-80'>{displayStr}</h1>
    </div>
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
      <div className="overflow-y-auto w-full px-[10%] md:px-[20%] xl:px-[30%] ">
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
