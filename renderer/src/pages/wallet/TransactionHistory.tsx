import dayjs from 'dayjs'
import { formatFilValue, truncateString } from 'src/lib/utils'
import { FILTransaction } from '../../../../shared/typings'
import Text from 'src/components/Text'
import SendIcon from 'src/assets/img/icons/send.svg?react'
import ReceiveIcon from 'src/assets/img/icons/receive.svg?react'
import classNames from 'classnames'
import stationIllustration from 'src/assets/img/station-illustration.png'

const TransactionHistory = ({
  walletTransactions = []
}: {
  walletTransactions: Array<FILTransaction>;
}) => {
  const className = classNames({
    'pr-4': walletTransactions && walletTransactions?.length > 5
  }, 'flex flex-col gap-4 max-h-[300px] overflow-y-scroll custom-scrollbar')

  return (
    <div className={className}>
      {walletTransactions?.length > 0
        ? walletTransactions?.map(transaction => (
        <div key={transaction.hash} className='flex gap-4'>
            {transaction.outgoing ? <SendIcon /> : <ReceiveIcon />}
            <div>
              <Text size='s' as='p'>
                {transaction.outgoing
                  ? `Sent to ${truncateString(transaction.address)}`
                  : 'Received'}
              </Text>
              <Text
                font='mono'
                size='3xs'
                color='secondary'
              >
                {dayjs(transaction.timestamp).format('MMM D, YYYY HH:mm')}
              </Text>
            </div>
            <Text font='mono' size='xs' className='ml-auto'>{formatFilValue(transaction.amount)} FIL</Text>
        </div>
        ))
        : (
        <div className='flex flex-col gap-3 justify-center items-center text-center'>
          <img src={stationIllustration} alt='Station' className='my-2' />
          <Text as="p" size='m' bold>No transfers yet</Text>
          <Text as="p" className='max-w-[240px]'>
            After your first transaction you will be able to view it here
          </Text>
        </div>
          )}
    </div>
  )
}

export default TransactionHistory
