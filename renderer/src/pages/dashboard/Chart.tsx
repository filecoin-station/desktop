import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { RewardsRecord } from 'src/hooks/StationRewards'
import { getRewardValue } from 'src/lib/utils'
import { TimeRange } from './ChartController'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DatasetIndex,
  ExternalToltipHandler,
  formatTickDate,
  hoverCrossLines,
  updateTooltipElement
} from './chart'
import ChartTooltip from './ChartTooltip'

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
    const { title, dataPoints, opacity } = tooltip

    const totalReceived = dataPoints[DatasetIndex.TotalReceived].raw as number
    const scheduled = dataPoints[DatasetIndex.Scheduled].raw as number
    const { x, y } = dataPoints[DatasetIndex.Scheduled].element

    updateTooltipElement({
      element: tooltipRef.current,
      date: title?.[0],
      totalReceived,
      scheduled,
      position: { x, y },
      opacity
    })
  }, [tooltipRef])

  useEffect(() => {
    updateAspectRatio()
  }, [])

  const labels = historicalRewards.map(record => new Date(record.timestamp).getTime())

  return (
    <div ref={containerRef} className='relative'>
      <ChartTooltip ref={tooltipRef} />
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
                drawTicks: false,
                z: 1
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
          },
          datasets: {
            line: {
              pointHoverRadius: 0,
              pointRadius: 0
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
        plugins={[hoverCrossLines]}
      />

    </div>
  )
}

export default Chart
