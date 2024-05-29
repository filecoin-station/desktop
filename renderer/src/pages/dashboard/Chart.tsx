import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  TimeScale,
  TimeSeriesScale
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { RewardsRecord, sumAllRewards } from 'src/hooks/StationRewards'
import { TimeRange } from './ChartController'
import { useEffect, useRef, useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  TimeSeriesScale,
  TimeScale,
  LineElement,
  TimeSeriesScale
)

const options = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  }
} as const

function getRewardValue (data: RewardsRecord['totalRewardsReceived'], moduleId: string) {
  if (moduleId === 'all') {
    return sumAllRewards(data)
  }

  return data[moduleId]
}

const timeFormatters = {
  daily: new Intl.DateTimeFormat('en-US', {
    day: 'numeric', month: 'short'
  }),
  monthly: new Intl.DateTimeFormat('en-GB', {
    month: 'short', year: '2-digit'
  })
}

function formatDate (date: string, index: number, timeRange: TimeRange) {
  if (timeRange === '7d') {
    return timeFormatters.daily.format(new Date(date))
  }

  if (timeRange === '1m') {
    return index % 4 === 0
      ? timeFormatters.daily.format(new Date(date))
      : ''
  }

  if (timeRange === '1y' || timeRange === 'all') {
    const dateVal = new Date(date)

    return dateVal.getDate() === 1 ? timeFormatters.monthly.format(dateVal) : ''
  }

  return timeFormatters.daily.format(new Date(date))
}

const yStepSizeForTimeRange = {
  '1d': 0.1,
  '7d': 0.1,
  '1m': 0.3,
  '1y': 0.7,
  all: 1
}

const Chart = ({
  historicalRewards,
  timeRange,
  moduleId
}: {
  historicalRewards: RewardsRecord[];
  timeRange: TimeRange;
  moduleId: string;
}) => {
  const labels = historicalRewards.map(record => new Date(record.timestamp).getTime())

  const [aspectRatio, setAspectRatio] = useState(2.55)
  const containerRef = useRef<HTMLDivElement>(null)

  function updateAspectRatio () {
    if (containerRef.current) {
      const parent = containerRef.current.getBoundingClientRect()
      containerRef.current.style.width = `${parent.width}px`
      containerRef.current.style.height = `${parent.height}px`
      setAspectRatio(parent.width / parent.height)
    }
  }

  useEffect(() => {
    updateAspectRatio()
  }, [])

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
            }
          },
          layout: {
            padding: 0,
            autoPadding: false
          },
          scales: {
            y: {
              ticks: {
                stepSize: yStepSizeForTimeRange[timeRange],
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
                drawTicks: false
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
                  return formatDate(this.getLabelForValue(Number(val)), index, timeRange)
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
    </div>
  )
}

export default Chart
