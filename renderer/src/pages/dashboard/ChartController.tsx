import { useMemo, useState } from 'react'
import { RewardsRecord } from 'src/hooks/StationRewards'
import Chart from './Chart'

const timeRanges = ['1d', '7d', '1m', '1y', 'all'] as const
type TimeRange = typeof timeRanges[number]

const timeRangeInDays = {
  '1d': 1,
  '7d': 7,
  '1m': 31,
  '1y': 365
}

function getDataInTimeRange (data: RewardsRecord[], timeRange: TimeRange) {
  if (timeRange === 'all') {
    return data
  }

  const currentDate = new Date()
  const cutOffDate = new Date().setDate(currentDate.getDate() - timeRangeInDays[timeRange])

  return data.filter(record => new Date(record.timestamp).getTime() > cutOffDate)
}

const ChartController = ({ historicalRewards }: {historicalRewards: RewardsRecord[]}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m')
  const [moduleId, setModuleId] = useState('all')

  const filteredHistoricalRewards = useMemo(
    () => getDataInTimeRange(historicalRewards, timeRange),
    [timeRange, historicalRewards]
  )

  const moduleIdsInRange = useMemo(
    () => filteredHistoricalRewards.reduce<string[]>(
      (acc, record) => [
        ...acc,
        ...Object.keys(record.totalScheduledRewards).filter((id) => !acc.includes(id))
      ], ['all']
    ), [filteredHistoricalRewards])

  return (
    <div>
      <div className='flex gap-4'>
        {timeRanges.map(value => (
          <button
            type='button'
            className={
              `border px-2 uppercase ${value === timeRange ? 'border-black' : 'border-grayscale-400'}`
            }
            key={value}
            onClick={() => setTimeRange(value)}
          >
            {value}
          </button>
        ))}
        <label htmlFor="moduleSelect">Module:
          <select name="moduleSelect" id="moduleSelect" onChange={(event) => setModuleId(event.target.value)}>
            {moduleIdsInRange.map((id) => (
              <option value={id} key={id}>{id}</option>
            ))}
          </select>
        </label>
      </div>
      <Chart historicalRewards={filteredHistoricalRewards} moduleId={moduleId} />
    </div>
  )
}

export default ChartController
