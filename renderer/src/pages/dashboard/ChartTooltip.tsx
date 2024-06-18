import { forwardRef } from 'react'
import Text from 'src/components/Text'

const ChartTooltip = forwardRef<HTMLDivElement>(function (_, ref) {
  return (
    <div ref={ref} className='absolute top-0 left-0 pointer-events-none opacity-0 z-10'>
      <div data-indicator className='relative w-5 h-5'>
        <div className={`w-2 h-2 rounded-full bg-primary absolute inset-0
        -translate-x-[50%] -translate-y-[50%]`}
        >
        </div>
        <div className={`w-5 h-5 rounded-full border border-primary border-dashed
        -translate-x-[50%] -translate-y-[50%] absolute inset-0 opacity-50`}
        ></div>
      </div>

      <div
        data-content
        className="transition-transform duration-200 ease-linear group absolute h-0"
      >
        <div className={`flex flex-col gap-3 p-3 rounded-lg w-[200px] border transition-all
        -translate-x-[50%] -translate-y-[150%] group-data-[ispayout=false]:border-slate-400
        group-data-[ispayout=true]:bg-white group-data-[ispayout=false]:bg-black
        group-data-[ispayout=true]:border-dashed group-data-[ispayout=true]:border-primary`}
        >
          <Text
            data-date
            font="mono"
            size='3xs'
            className='group-data-[ispayout=true]:text-slate-800 group-data-[ispayout=false]:text-slate-400'
          >{' '}
          </Text>
          <div>
            <Text
              font="mono"
              size='3xs'
              className={`mb-1 block group-data-[ispayout=true]:text-slate-800
              group-data-[ispayout=false]:text-slate-400`}
            >
              Total rewards received:
            </Text>
            <Text
              font="mono"
              size='xs'
              bold
              data-totalreceived
              className='group-data-[ispayout=true]:text-slate-800 group-data-[ispayout=false]:text-white block'
            >{' '}
            </Text>
          </div>
          <div>
            <Text
              font="mono"
              size='3xs'
              className={`mb-1 block group-data-[ispayout=true]:text-slate-800
              group-data-[ispayout=false]:text-slate-400`}
              data-scheduled-label
            >
              Rewards accrued:
            </Text>
            <Text
              font="mono"
              size='xs'
              color='white'
              bold
              data-scheduled
              className={`group-data-[ispayout=true]:text-primary group-data-[ispayout=false]:text-white block
              group-data-[ispayout=false]:text-mono-xs group-data-[ispayout=true]:text-mono-s`}
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
