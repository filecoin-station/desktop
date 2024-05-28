import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'
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
  const { currentTransaction } = useCurrentTransactionStatus(transaction)

  if (currentTransaction?.status === 'processing') {
    return (
      <StatusWrapper
        icon={<LoadingIcon className="text-primary animate-spin" />}
        text={currentTransaction?.outgoing ? 'Sending...' : 'Receiving...'}
      />
    )
  }

  if (currentTransaction?.status === 'succeeded') {
    return (
      <StatusWrapper
        icon={<CheckmarkIcon className='text-white fill-primary' />}
        text={currentTransaction?.outgoing ? 'Sent' : 'Received'}
      />
    )
  }

  if (currentTransaction?.status === 'failed') {
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
