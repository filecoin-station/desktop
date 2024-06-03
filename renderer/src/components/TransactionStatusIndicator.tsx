import { FILTransactionProcessing } from '../../../shared/typings'
import Text from './Text'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'
import LoadingIcon from 'src/assets/img/icons/loading.svg?react'
import WarningIcon from 'src/assets/img/icons/warning.svg?react'
import { ReactNode } from 'react'

const StatusWrapper = ({
  icon,
  text
} : {
  icon: ReactNode;
  text: string;
}) => (
  <div className='flex gap-2 items-center'>
    {icon}
    <Text as='p' size='s'>
      {text}
    </Text>
  </div>
)

const TransactionStatusIndicator = ({
  transaction
}: {
  transaction?: FILTransactionProcessing;
}) => {
  if (transaction?.status === 'processing') {
    return (
      <StatusWrapper
        icon={<LoadingIcon className="text-primary animate-spin" />}
        text={transaction?.outgoing ? 'Sending...' : 'Receiving...'}
      />
    )
  }

  if (transaction?.status === 'succeeded') {
    return (
      <StatusWrapper
        icon={<CheckmarkIcon className='text-white fill-primary' />}
        text={transaction?.outgoing ? 'Sent' : 'Received'}
      />
    )
  }

  if (transaction?.status === 'failed') {
    return (
      <StatusWrapper
        icon={<WarningIcon className='text-red-400' />}
        text="Failed"
      />
    )
  }

  return null
}

export default TransactionStatusIndicator
