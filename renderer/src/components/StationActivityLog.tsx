import React, {FC} from 'react'
import { IndexRouteProps } from 'react-router-dom';

interface IStationActivityLog {
  logStream: {time: EpochTimeStamp, msg: string}[]| undefined;
}

interface ILogElement {
  time: number;
  msg: string,
  index: number
}

const LogElement: FC<ILogElement> = (el) => {
  return <p>{el.index}: {el.msg}</p>
}

const StationActivityLog: FC<IStationActivityLog> = ({logStream}) => {
  console.log(logStream)
  return (
    <div className="w-[80%] md:w-[60%] xl:w-[40%] mt-10 pb-20 relative">
      <h1 className='text-xl font-bold'>Activity log</h1>
      <div className="mt-4 max-h-full overflow-y-auto bg-red-100">
        {logStream && logStream.reverse().map((el, index) => <LogElement key={el.time} time={el.time} msg={el.msg} index={index}/>)}
      </div>
    </div>
  )
}

export default StationActivityLog