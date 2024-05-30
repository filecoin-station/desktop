import { useMemo, useState } from 'react'
import { RewardsRecord } from 'src/hooks/StationRewards'
import Chart from './Chart'
import { Select, SelectItem } from 'src/components/Select'
import { ToggleGroup, ToggleGroupButton } from 'src/components/ToggleGroup'

const timeRanges = ['1d', '7d', '1m', '1y', 'all'] as const
export type TimeRange = typeof timeRanges[number]

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
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
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
      ], ['All modules']
    ), [filteredHistoricalRewards])

  return (
    <div className=''>
      <div className='flex gap-4 p-5'>
        <ToggleGroup onValueChange={(value: TimeRange) => setTimeRange(value)} defaultValue={timeRange}>
          {timeRanges.map(value => (
            <ToggleGroupButton
              key={value}
              value={value}
            >
              {value.toUpperCase()}
            </ToggleGroupButton>
          ))}
        </ToggleGroup>
        <Select
          label='Module'
          onValueChange={(value) => {
            setModuleId(value === 'All modules' ? 'all' : value)
          }}
          defaultValue='All modules'
        >
          {moduleIdsInRange.map((id) => (
            <SelectItem
              label={id}
              value={id}
              key={id}
            />
          ))}
        </Select>
      </div>
      <section className='px-2'>
        <Chart historicalRewards={filteredHistoricalRewards} moduleId={moduleId} timeRange={timeRange} />
      </section>
    </div>
  )
}

export default ChartController
