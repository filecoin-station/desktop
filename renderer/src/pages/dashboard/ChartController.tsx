import { useMemo, useState } from 'react'
import { RewardsRecord } from 'src/hooks/StationRewards'
import Chart from './Chart'
import { Select, SelectItem } from 'src/components/Select'
import { TabButton, TabButtonGroup } from 'src/components/TabButton'

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
    <div className='p-5'>
      <div className='flex gap-4 mb-10'>
        <TabButtonGroup>
          {timeRanges.map(value => (
            <TabButton
              key={value}
              selected={value === timeRange}
              onClick={() => setTimeRange(value)}
            >
              {value.toUpperCase()}
            </TabButton>
          ))}
        </TabButtonGroup>
        <Select label='Module' onValueChange={(value) => setModuleId(value)}>
          {moduleIdsInRange.map((id) => (
            <SelectItem
              label={id}
              value={id}
              key={id}
            />
          ))}
        </Select>
      </div>
      <Chart historicalRewards={filteredHistoricalRewards} moduleId={moduleId} />
    </div>
  )
}

export default ChartController
