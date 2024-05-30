import { forwardRef } from 'react'
import Text from 'src/components/Text'

const ChartTooltip = forwardRef<HTMLDivElement>(function (_, ref) {
  return (
    <div ref={ref} className='absolute top-0 left-0 pointer-events-none opacity-0'>
      <div data-indicator>
        <div className='w-2 h-2 rounded-full bg-primary -translate-y-[50%] -translate-x-[50%]'></div>
      </div>

      <div
        data-content
        className="transition-transform duration-200 ease-linear group"
      >
        <div className={`flex flex-col gap-3 p-3 rounded-lg w-[200px] border transition-all
        -translate-x-[50%] -translate-y-[130%] group-data-[light=false]:border-slate-400
        group-data-[light=true]:bg-white group-data-[light=false]:bg-black
        group-data-[light=true]:border-dashed group-data-[light=true]:border-primary`}
        >
          <Text
            data-date
            font="mono"
            size='3xs'
            className='group-data-[light=true]:text-slate-800 group-data-[light=false]:text-slate-400'
          >{' '}
          </Text>
          <div>
            <Text
              font="mono"
              size='3xs'
              className='mb-1 block group-data-[light=true]:text-slate-800 group-data-[light=false]:text-slate-400'
            >
              Total rewards received:
            </Text>
            <Text
              font="mono"
              size='xs'
              bold
              data-totalreceived
              className='group-data-[light=true]:text-slate-800 group-data-[light=false]:text-white block'
            >{' '}
            </Text>
          </div>
          <div>
            <Text
              font="mono"
              size='3xs'
              className='mb-1 block group-data-[light=true]:text-slate-800 group-data-[light=false]:text-slate-400'
            >
              Rewards accrued:
            </Text>
            <Text
              font="mono"
              size='xs'
              color='white'
              bold
              data-scheduled
              className='group-data-[light=true]:text-primary group-data-[light=false]:text-white block'
            >{' '}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
})

ChartTooltip.displayName = 'ChartTooltip'

export default ChartTooltip
