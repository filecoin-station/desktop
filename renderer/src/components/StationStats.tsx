import React, { FC } from 'react'

type IStationStats = {
  filAddress: string | undefined;
  disconnect: () => void;
  totalJobs: number | undefined;
  totalEarns: number | undefined
}

const StationStats: FC<IStationStats> = ({ filAddress, disconnect, totalJobs, totalEarns }) => {
  const displayWalletAddr = filAddress?.substring(0, 4) + '...' + filAddress?.substring(filAddress.length - 4, filAddress.length)
  
  return (
    <div className="w-[80%] md:w-[60%] xl:w-[40%] mt-10 mb-10 relative">

      <div className="flex justify-end">
        <span className='text-slate-200 text-right'>
          {displayWalletAddr}
        </span>
        <button className='text-slate-200 underline ml-4' onClick={disconnect}>
          change
        </button>
      </div>

      <div className='h-full w-full'>
        <div className='h-full flex flex-row items-end pb-10'>
          <div className='basis-1/2 flex flex-col max-w-[50%]'>
            <p className='text-blue-600'>Total Jobs Completed</p>
            <p className='text-3xl text-blue-600'>{totalJobs ? totalJobs : '---'}</p>
          </div>
          <div className='basis-1/2 flex flex-col max-w-[50%]'>
            <p className='text-blue-600'>Total Earnings</p>
            <p className='text-3xl text-blue-600'>
              {totalEarns ? totalEarns : '---'} 
              {totalEarns && <span className='ml-1 text-base'>FIL</span>}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default StationStats