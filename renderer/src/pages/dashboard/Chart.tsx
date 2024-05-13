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

const Chart = ({ historicalRewards }: {historicalRewards: RewardsRecord[]}) => {
  const labels = historicalRewards.map(record => new Date(record.timestamp).toDateString())

  const data = {
    labels,
    datasets: [
      {
        label: 'Total rewards received',
        data: historicalRewards.map(record => record.totalRewardsReceived),
        borderColor: '#777',
        stepped: true
      },
      {
        label: 'Scheduled rewards',
        data: historicalRewards.map(record => record.totalScheduledRewards),
        borderColor: '#ddd',
        fill: true,
        backgroundColor: '#eee'
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
