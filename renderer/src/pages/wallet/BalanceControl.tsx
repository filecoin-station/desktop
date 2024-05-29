import Button from 'src/components/Button'
import Text from 'src/components/Text'
import { formatFilValue } from 'src/lib/utils'
import { Wallet } from 'src/hooks/StationWallet'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'
import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'
import Tooltip from 'src/components/Tooltip'
import { ReactNode } from 'react'

const TooltipWrapper = ({ children, hasTooltip }: {children: ReactNode; hasTooltip: boolean}) => {
  if (!hasTooltip) return children

  return (
    <Tooltip
      content={`Once your rewards reach the minimum amount, you can transfer them. 
    Check back to see when you can make your next transfer.`}
      size='s'
      bg='light'
      sideOffset={10}
      trigger={(
        <span>{children}</span>
      )}
    />
  )
}

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
  const { currentTransaction } = useCurrentTransactionStatus(processingTransaction)
  const hasSufficientBalance = Number(walletBalance) >= sendThreshold

  return (
    <div className={`w-[260px] aspect-square mx-auto bg-black mt-[100px]
                    border border-dashed border-slate-50 rounded-full z-10`}
    >
      <div className='m-auto flex flex-col gap-5 items-center justify-center h-full'>
        <div className='flex flex-col justify-end h-[55%]'>
          <Text font="mono" size="xl" bold className="text-slate-50">
            {formatFilValue(walletBalance)} FIL
          </Text>
        </div>
        <div className='h-[45%] flex flex-col'>
          {!currentTransaction && (
            <TooltipWrapper hasTooltip={!hasSufficientBalance}>
              <Button
                type='button'
                variant='primary'
                onClick={transfer}
                disabled={!hasSufficientBalance}
              >
                Transfer
              </Button>
            </TooltipWrapper>
          )}
          {currentTransaction?.status === 'processing' && (
            <div className='flex gap-3 items-center mt-2'>
              <Text font='mono' size='2xs' className="text-slate-50">Sending...</Text>
            </div>
          )}
          {currentTransaction?.status === 'failed' && (
            <div className='flex gap-3 items-center'>
              <Text font='mono' size='2xs' className="text-slate-50">Failed</Text>
            </div>
          )}
          {currentTransaction?.status === 'succeeded' && (
            <div className='flex gap-3 items-center'>
              <CheckmarkIcon className="text-slate-50" />
              <Text font='mono' size='2xs' className="text-slate-50">Sent</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BalanceControl
