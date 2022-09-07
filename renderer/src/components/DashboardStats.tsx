import React, { FC } from 'react'

type IStationStats = {
  totalJobs: number | undefined;
  totalEarns: number | undefined
}

const StationStats: FC<IStationStats> = ({ totalJobs, totalEarns }) => {

  return (
      <>
        <div className='basis-1/2 flex flex-col min-w-[50%]'>
          <p className='text-blue-600'>Total Jobs Completed</p>
          <p className='text-3xl text-blue-600'>{totalJobs ? totalJobs : '---'}</p>
        </div>
        <div className='basis-1/2 flex flex-col min-w-[50%]'>
          <p className='text-blue-600'>Total Earnings</p>
          <p className='text-3xl text-blue-600'>
            {totalEarns ? totalEarns : '---'}
            {totalEarns && <span className='ml-1 text-base'>FIL</span>}
          </p>
        </div>
      </>

  )
}

export default StationStats