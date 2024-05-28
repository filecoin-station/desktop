import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'
import { FILTransactionProcessing } from '../../../shared/typings'
import Text from './Text'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'
import { ReactNode } from 'react'

const TransactionStatusIndicator = ({
  transaction,
  fallback = null
}: {
    transaction?: FILTransactionProcessing;
    fallback?: ReactNode;
}) => {
  const { status, currentTransaction } = useCurrentTransactionStatus(transaction)

  if (status === 'processing') {
    return (
      <Text as='p' size='s'>
        Sending...
      </Text>
    )
  }

  if (status === 'complete') {
    <div className='flex gap-3 items-center'>
      <CheckmarkIcon className='text-white fill-primary' />
      <Text as='p' size='s'>
        {currentTransaction?.outgoing ? 'Sent' : 'Received'}
      </Text>
    </div>
  }

  return fallback
}

export default TransactionStatusIndicator
