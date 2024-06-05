import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { RewardsRecord, sumAllRewards } from 'src/hooks/StationRewards'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  LineElement
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

const Chart = ({
  historicalRewards,
  moduleId
}: {
  historicalRewards: RewardsRecord[];
  moduleId: string;
}) => {
  const labels = historicalRewards.map(record => new Date(record.timestamp).toDateString())

  const data = {
    labels,
    datasets: [
      {
        label: 'Total rewards received',
        data: historicalRewards.map(record => getRewardValue(record.totalRewardsReceived, moduleId)),
        borderColor: '#777',
        stepped: true
      },
      {
        label: 'Scheduled rewards',
        data: historicalRewards.map(record =>
          getRewardValue(record.totalScheduledRewards, moduleId) +
          getRewardValue(record.totalRewardsReceived, moduleId)),
        borderColor: '#ddd',
        border: false,
        fill: '-1',
        backgroundColor: '#ddd'
      }
    ]
  }

  return (
    <div className='relative w-[70vw] h-[64vh]'>
      <Line options={options} data={data}/>
    </div>
  )
}

export default Chart
