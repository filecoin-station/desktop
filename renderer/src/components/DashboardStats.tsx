import React, { FC } from 'react'

type IStationStats = {
  totalJobs: number | undefined;
  totalEarns: number | undefined
}

const intlFormat = (counter:number, options={}) => {
  return new Intl.NumberFormat(window.navigator.language, options).format(counter)
}

const StationStats: FC<IStationStats> = ({ totalJobs, totalEarns }) => {
  const formatEarnings = totalEarns ? intlFormat(totalEarns, {maximumFractionDigits: 4, minimumFractionDigits: 2}) : '---'
  const formatJobs = totalJobs ? intlFormat(totalJobs) : '---'

  return (
      <>
        <div className='flex flex-col'>
          <p className='text-body-s uppercase opacity-80'>Total Jobs Completed</p>
          <p className='title font-number font-bold text-header-l text-black'>
            {formatJobs }</p>
        </div>
        <div className='flex flex-col'>
          <p className='text-body-s uppercase opacity-80'>Total Earnings</p>
          <p className='title font-number font-bold text-header-l text-black'>
            {formatEarnings}
            <span className='ml-1 text-base'>FIL</span>
          </p>
        </div>
      </>
  )
}

export default StationStats
