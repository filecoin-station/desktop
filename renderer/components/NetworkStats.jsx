import dynamic from 'next/dynamic'
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false })

const NetworkStats = () => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-2 gap-6'>
      <div className=''>
        <div className='px-4 py-5 sm:px-6'>
          <p className='mt-1 max-w-2xl text-md text-slate-800 dark:text-slate-200'>
            Incoming Traffic
          </p>
        </div>
        <GaugeChart
          textColor='#64748b'
          id='incoming-traffic'
          needleColor='#64748b'
          needleBaseColor='#64748b'
          nrOfLevels={30}
          colors={['#22c55e', '#eab308', '#991b1b']}
          arcWidth={0.3}
          percent={0.24}
          formatTextValue={(value) => value + ' B/s'}
        />
      </div>
      <div className=''>
        <div className='px-4 py-5 sm:px-6'>
          <p className='mt-1 max-w-2xl text-md text-slate-800 dark:text-slate-200'>
            Outgoing Traffic
          </p>
        </div>
        <GaugeChart
          textColor='#64748b'
          id='outgoing-traffic'
          needleColor='#64748b'
          needleBaseColor='#64748b'
          nrOfLevels={30}
          colors={['#22c55e', '#eab308', '#991b1b']}
          arcWidth={0.3}
          percent={0.46}
          formatTextValue={(value) => value + ' B/s'}
        />
      </div>
    </div>
  )
}

export default NetworkStats
