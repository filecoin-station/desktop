import { useCallback, useEffect, useState } from 'react'
import Button from 'src/components/Button'
import Text from 'src/components/Text'
import { formatFilValue } from 'src/lib/utils'
import { Wallet } from 'src/hooks/StationWallet'

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
  const [status, setStatus] = useState<'accruing' | 'idle' | 'processing' | 'complete'>('idle')

  const setBalanceStateAfterComplete = useCallback((oldStatus: typeof status, newStatus: typeof status) => {
    if (oldStatus === 'processing') {
      setStatus('complete')
      setTimeout(() => {
        console.log(`Set: ${status}, after delay`)
        setStatus(newStatus)
      }, 2000)
    } else {
      setStatus(newStatus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const hasSufficientBalance = Number(walletBalance) >= sendThreshold

    if (processingTransaction) {
      setStatus('processing')
    } else if (!processingTransaction && hasSufficientBalance) { // TODO: complete
      setBalanceStateAfterComplete(status, 'idle')
    } else if (!processingTransaction && !hasSufficientBalance) {
      setBalanceStateAfterComplete(status, 'accruing')
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
          <Text font='mono' size='2xs' className="text-slate-50">Sent</Text>
        )}
      </div>
    </div>
  )
}

export default BalanceControl
