import Text from 'src/components/Text'
import { formatFilValue } from 'src/lib/utils'
import InfoIcon from 'src/assets/img/icons/info.svg?react'
import Tooltip from 'src/components/Tooltip'

const RewardsInfo = ({
  totalRewardsReceived,
  scheduledRewards
}: {
  totalRewardsReceived: number;
  scheduledRewards?: string;
}) => {
  return (
    <section className="flex justify-between">
      <div className='p-5 flex flex-col gap-2'>
        <Text as="p" font='mono' size='3xs' color='primary' uppercase>
            &#47;&#47; Total rewards received ... :
        </Text>
        <Text as='p' font='mono' size='xl' data-testid="earnings-counter">
          {formatFilValue(totalRewardsReceived.toString())}{' '}FIL
        </Text>
      </div>

      <div className='border-l border-b border-slate-400 border-dashed rounded-bl-lg flex p-5 min-w-[237px]'>
        <div className='flex flex-col gap-2 m-auto'>
          <Text as="p" font='mono' size='3xs' color='primary' uppercase className='flex'>
            &#47;&#47; Next payout ... :
            <Tooltip
              trigger={
                <i><InfoIcon className='text-primary relative -top-3' /></i>
              }
              style={{ maxWidth: '230px' }}
              content={`This is the reward total you have accrued since your last payout. 
              Scheduled earning will be sent to your Station Wallet approximately once a month, 
              provided you have earned more than the payout threshold.`}
            />

          </Text>
          <Text as='p' font='mono' size='s'>
            {formatFilValue(scheduledRewards)}{' '}FIL
          </Text>
        </div>
      </div>
    </section>
  )
}

export default RewardsInfo
