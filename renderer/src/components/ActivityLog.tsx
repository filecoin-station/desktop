import { FC } from 'react'
import { ActivityEventMessage } from '../typings';

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
  const today = new Intl.DateTimeFormat(window.navigator.language, {}).format(new Date())
  const yesterday_ = new Date()
  yesterday_.setDate(yesterday_.getDate()-1)
  const yesterday = new Intl.DateTimeFormat(window.navigator.language, {}).format(yesterday_)
  
  const displayStr = date === today 
                     ? 'today' 
                     : date === yesterday ? 'yesterday' : date
  return (
    <>
      <h1>{displayStr}</h1>
    </>
  );
}

interface IActivityLog {
  logStream: ActivityEventMessage[] | undefined;
}


const ActivityLog: FC<IActivityLog> = ({ logStream }) => {
  const sortedLogStream = logStream?.sort(function (x, y) {
    return x.time - y.time;
  })

  const groups = sortedLogStream?.reverse().reduce((groups: any, log: ActivityEventMessage) => {
    const date = new Intl.DateTimeFormat(window.navigator.language, {}).format(new Date(log.time))

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date] = [...groups[date], log]
    return groups;
  }, {});

  const groupArrays = groups && Object.keys(groups).map((date) => {
    return {
      date,
      activities: groups[date]
    };
  });


  return (
    <>
      <div className="mt-4 max-h-full overflow-y-auto ">
        {groupArrays
          ? groupArrays.map((data: { date: string, activities: ActivityEventMessage[] | undefined }) => {
            return (
              <>
                <div className='bg-red-300'><DateSeparator date={data.date}/></div>
                {data.activities?.map((element, index) => {
                  return <LogElement key={element.time} time={element.time} msg={element.msg} type={element.type} />
                })}
              </>
            )
          })
          : <p>No activity to show</p>
        }
      </div>
    </>
  )
}

export default ActivityLog
