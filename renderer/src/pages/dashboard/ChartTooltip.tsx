import { forwardRef } from 'react'
import Text from 'src/components/Text'

const ChartTooltip = forwardRef<HTMLDivElement>(function (_props, ref) {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-0  transition-transform opacity-0 pointer-events-none"
    >
      {<div className='w-2 h-2 rounded-full bg-primary -translate-y-[50%] -translate-x-[50%]'></div>}
      <div
        className={`flex flex-col gap-3 bg-black border border-slate-400 p-3 rounded-lg 
          -translate-x-[50%] -translate-y-[150%]`}
      >
        <Text data-date font="mono" size='3xs' className='date text-slate-400'> </Text>
        <div>
          <Text font="mono" size='3xs' className='mb-1 block text-slate-400'>
              Total rewards received:
          </Text>
          <Text font="mono" size='xs' color='white' bold as='p' data-totalreceived> </Text>
        </div>
        <div>
          <Text font="mono" size='3xs'className='mb-1 block text-slate-400'>
              Rewards accrued:
          </Text>
          <Text font="mono" size='xs' color='white' bold as='p' data-scheduled> </Text>
        </div>
      </div>
    </div>
  )
})

ChartTooltip.displayName = 'ChartTooltip'

export default ChartTooltip
