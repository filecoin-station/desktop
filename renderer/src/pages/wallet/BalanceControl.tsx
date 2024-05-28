import { useCallback, useEffect, useState } from 'react'
import Button from 'src/components/Button'
import Text from 'src/components/Text'
import { formatFilValue } from 'src/lib/utils'
import { Wallet } from 'src/hooks/StationWallet'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'

type Status = 'accruing' | 'idle' | 'processing' | 'complete'

const BalanceControl = ({
  walletBalance = '',
  sendThreshold,
  processingTransaction,
  transfer
}: {
    walletBalance?: string;
    sendThreshold: number;
    processingTransaction: Wallet['processingTransaction'];
    transfer: () => void;
}) => {
  const [status, setStatus] = useState<Status>('idle')

  const setStatusAfterComplete = useCallback((oldStatus: Status, newStatus: Status) => {
    if (oldStatus === 'processing') {
      setStatus('complete')
      setTimeout(() => setStatus(newStatus), 2000)
    } else {
      setStatus(newStatus)
    }
  }, [])

  useEffect(() => {
    const hasSufficientBalance = Number(walletBalance) >= sendThreshold

    if (processingTransaction) {
      setStatus('processing')
    } else if (!processingTransaction && hasSufficientBalance) {
      setStatusAfterComplete(status, 'idle')
    } else if (!processingTransaction && !hasSufficientBalance) {
      setStatusAfterComplete(status, 'accruing')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingTransaction, walletBalance])

  return (
    <div className={`w-[260px] aspect-square mx-auto bg-black mt-[100px]
                    border border-dashed border-slate-50 rounded-full z-10`}
    >
      <div className='m-auto flex flex-col gap-5 items-center justify-center h-full'>
        <Text font="mono" size="xl" bold className="text-slate-50">
          {formatFilValue(walletBalance)} FIL
        </Text>
        {status === 'idle' && (
          <Button
            type='button'
            variant='primary'
            onClick={transfer}
          >
            Transfer
          </Button>
        )}
        {status === 'accruing' && (
          <Text font='mono' size='2xs' className="text-slate-50">Accruing...</Text>
        )}
        {status === 'processing' && (
          <Text font='mono' size='2xs' className="text-slate-50">Sending...</Text>
        )}
        {status === 'complete' && (
          <div className='flex gap-3 items-center'>
            <CheckmarkIcon className="text-slate-50" />
            <Text font='mono' size='2xs' className="text-slate-50">Sent</Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default BalanceControl
