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
  datasetIndex,
  ExternalToltipHandler,
  colors,
  fonts,
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

    const totalReceived = dataPoints[datasetIndex.totalRewards].raw as number
    const scheduled = dataPoints[datasetIndex.scheduled].raw as number
    const { x, y } = dataPoints[datasetIndex.scheduled].element

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
                  family: fonts.mono,
                  size: 12
                },
                padding: 10,
                color: colors.black
              },
              border: {
                dash: [4, 4],
                display: false
              },
              grid: {
                color: colors.xLine,
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
                color: colors.xAxisText,
                font: {
                  family: fonts.body,
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
              borderColor: colors.totalRewardsLine,
              fill: 'start',
              backgroundColor: colors.totalRewardsBg,
              stepped: true
            },
            {
              label: 'Scheduled rewards',
              data: historicalRewards.map(record =>
                getRewardValue(record.totalScheduledRewards, moduleId) +
          getRewardValue(record.totalRewardsReceived, moduleId)),
              borderColor: colors.scheduledBg,
              pointRadius: 0,
              tension: 0.4,
              fill: '-1',
              backgroundColor: colors.scheduledBg
            }
          ]
        }}
        plugins={[hoverCrossLines]}
      />

    </div>
  )
}

export default Chart
