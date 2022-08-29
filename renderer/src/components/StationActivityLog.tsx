import React, {FC} from 'react'

interface IStationActivityLog {
  logStream: {time: EpochTimeStamp, msg: string}[]| undefined;
}

interface ILogElement {
  time: number;
  msg: string
}

const LogElement: FC<ILogElement> = (el) => {
  return <p>{el.msg}</p>
}

const StationActivityLog: FC<IStationActivityLog> = ({logStream}) => {
  console.log(logStream)
  return (
    <div className="w-[80%] md:w-[60%] xl:w-[40%] mt-10 pb-20 relative">
      <h1 className='text-xl font-bold'>Activity log</h1>
      <div className="mt-4 max-h-full overflow-y-auto bg-red-100">
        {logStream && logStream.map((el) => <LogElement time={el.time} msg={el.msg}/>)}
      </div>
    </div>
  )
}

export default StationActivityLog