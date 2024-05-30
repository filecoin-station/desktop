import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  TimeScale,
  TimeSeriesScale,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { RewardsRecord } from 'src/hooks/StationRewards'
import { formatFilValue, getRewardValue } from 'src/lib/utils'
import { TimeRange } from './ChartController'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DatasetIndex, ExternalToltipHandler, formatTickDate, updateTooltipElement } from './chart'
import Text from 'src/components/Text'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  LineElement,
  Tooltip
)

const Chart = ({
  historicalRewards,
  timeRange,
  moduleId
}: {
  historicalRewards: RewardsRecord[];
  timeRange: TimeRange;
  moduleId: string;
}) => {
  const [aspectRatio, setAspectRatio] = useState(2.55)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  function updateAspectRatio () {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      containerRef.current.style.width = `${width}px`
      containerRef.current.style.height = `${height}px`
      setAspectRatio(width / height)
    }
  }

  const onTooltipUpdate = useCallback<ExternalToltipHandler>(({ tooltip }) => {
    if (!tooltipRef.current) {
      return
    }

    const [date] = tooltip.title
    const totalReceived = tooltip.dataPoints[DatasetIndex.TotalReceived].raw as number
    const scheduled = tooltip.dataPoints[DatasetIndex.Scheduled].raw as number
    const { x, y } = tooltip.dataPoints[DatasetIndex.Scheduled].element

    updateTooltipElement({
      element: tooltipRef.current,
      date,
      totalReceived,
      scheduled,
      position: { x, y }
    })

    return true
  }, [tooltipRef])

  useEffect(() => {
    updateAspectRatio()
  }, [])

  const labels = historicalRewards.map(record => new Date(record.timestamp).getTime())

  return (
    <div ref={containerRef} className='relative'>
      <Line
        options={{
          responsive: true,
          aspectRatio,
          animation: false,
          onResize: updateAspectRatio,
          plugins: {
            legend: {
              display: true
            },
            title: {
              display: false
            },
            tooltip: {
              enabled: false,
              external: onTooltipUpdate
              // external: externalTooltipHandler
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          layout: {
            padding: 0,
            autoPadding: false
          },
          scales: {
            y: {
              ticks: {
                font: {
                  family: 'SpaceMono, mono',
                  size: 12
                },
                padding: 10,
                color: '#000'
              },
              border: {
                dash: [4, 4],
                display: false
              },
              grid: {
                color: '#D9D9E4',
                drawTicks: false,
                drawOnChartArea: true
              }
            },
            x: {
              grid: {
                drawOnChartArea: false,
                drawTicks: false
              },
              border: {
                display: false
              },
              ticks: {
                color: '#5F5A73',
                font: {
                  family: 'SpaceGrotesk, serif',
                  size: 12
                },
                align: 'center',
                padding: 20,
                maxRotation: 0,
                autoSkip: false,
                callback: function (val, index) {
                  return formatTickDate(this.getLabelForValue(Number(val)), index, timeRange)
                }
              }
            }
          }
        }}
        data={{
          labels,
          datasets: [
            {
              label: 'Total rewards received',
              data: historicalRewards.map(record => getRewardValue(record.totalRewardsReceived, moduleId)),
              borderColor: '#2A1CF7',
              fill: 'start',
              backgroundColor: '#b5b2f6',
              pointRadius: 0,
              stepped: true
            },
            {
              label: 'Scheduled rewards',
              data: historicalRewards.map(record =>
                getRewardValue(record.totalScheduledRewards, moduleId) +
          getRewardValue(record.totalRewardsReceived, moduleId)),
              borderColor: '#dddcf5',
              pointRadius: 0,
              tension: 0.4,
              fill: '-1',
              backgroundColor: '#dddcf5'
            }
          ]
        }}
      />
      <div
        ref={tooltipRef}
        className={'absolute top-0 left-0  transition-transform opacity-0'}
      >
        <div className='flex flex-col gap-3 bg-black border border-slate-400 p-3 rounded-lg -translate-x-[50%]'>
          <Text data-date font="mono" size='3xs' color='secondary' className='date'> </Text>
          <div>
            <Text font="mono" size='3xs' color='secondary' className='mb-1 block'>
              Total rewards received:
            </Text>
            <Text font="mono" size='xs' color='white' bold as='p' data-totalReceived> </Text>
          </div>
          <div>
            <Text font="mono" size='3xs' color='secondary' className='mb-1 block'>
              Rewards accrued:
            </Text>
            <Text font="mono" size='xs' color='white' bold as='p' data-scheduled> </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chart
