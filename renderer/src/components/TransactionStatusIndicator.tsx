import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'
import { FILTransactionProcessing } from '../../../shared/typings'
import Text from './Text'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'
import LoadingIcon from 'src/assets/img/icons/loading.svg?react'
import { ReactNode } from 'react'
import classNames from 'classnames'

const TransactionStatusIndicator = ({
  transaction,
  fallback = null,
  dark
}: {
    transaction?: FILTransactionProcessing;
    fallback?: ReactNode;
    dark?: boolean;
}) => {
  const { status, currentTransaction } = useCurrentTransactionStatus(transaction)

  if (status === 'processing') {
    return (
      <div className='flex gap-3 items-center'>
        <LoadingIcon className={classNames(dark ? 'text-white' : 'text-black', 'animate-spin')} />
        <Text as='p' size='s' color={dark ? 'white' : 'black'}>
          {currentTransaction?.outgoing ? 'Sending...' : 'Receiving...'}
        </Text>
      </div>
    )
  }

  if (status === 'complete') {
    return (
      <div className='flex gap-3 items-center'>
        <CheckmarkIcon className='text-white fill-primary' />
        <Text as='p' size='s' color={dark ? 'white' : 'black'}>
          {currentTransaction?.outgoing ? 'Sent' : 'Received'}
        </Text>
      </div>
    )
  }

  return fallback
}

export default TransactionStatusIndicator
