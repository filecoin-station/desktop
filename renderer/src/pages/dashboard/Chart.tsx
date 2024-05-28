import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { RewardsRecord } from 'src/hooks/StationRewards'
import { getRewardValue } from 'src/lib/utils'

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
    <div>
      <Line options={options} data={data} />
    </div>
  )
}

export default Chart
