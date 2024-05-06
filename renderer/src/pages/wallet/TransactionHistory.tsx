import dayjs from 'dayjs'
import { formatFilValue, truncateString } from 'src/lib/utils'
import { FILTransaction, FILTransactionProcessing } from '../../../../shared/typings'

const TransactionHistory = ({
  walletTransactions,
  processingTransaction
}: {
  walletTransactions: Array<FILTransaction> | undefined;
  processingTransaction: FILTransactionProcessing | undefined;
}) => {
  return (
    <div className='flex flex-col gap-2'>
        <p>Transaction history</p>

        {processingTransaction && (
            <div className='border'>
                <div className='flex gap-4'>
                    <p>{processingTransaction.outgoing
                      ? `Sending to ${truncateString(processingTransaction.address)}`
                      : 'Receiving'}
                    </p>
                    <p>{formatFilValue(processingTransaction.amount)}FIL</p>
                </div>
                <p>{dayjs(processingTransaction.timestamp).format('DD/MM/YYYY')}</p>
            </div>
        )}

        {walletTransactions?.map(transaction => (
            <div key={transaction.hash}>
                <div className='flex gap-4'>
                    <p>{transaction.outgoing
                      ? `Sent to ${truncateString(transaction.address)}`
                      : 'Received'}
                    </p>
                    <p>{formatFilValue(transaction.amount)}FIL</p>
                </div>
                <p>{dayjs(transaction.timestamp).format('DD/MM/YYYY')}</p>
            </div>
        ))}
    </div>
  )
}

export default TransactionHistory
