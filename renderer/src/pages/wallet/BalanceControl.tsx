import Button from 'src/components/Button'
import Text from 'src/components/Text'
import { formatFilValue } from 'src/lib/utils'
import { Wallet } from 'src/hooks/StationWallet'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'
import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'
import Tooltip from 'src/components/Tooltip'
import { ReactNode, useState } from 'react'
import Transition from 'src/components/Transition'

const TooltipWrapper = ({ children, hasTooltip }: {children: ReactNode; hasTooltip: boolean}) => {
  if (!hasTooltip) return children

  return (
    <Tooltip
      style={{ maxWidth: '232px' }}
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
  transferAllFundsToDestinationWallet
}: {
  walletBalance?: string;
  sendThreshold: number;
  processingTransaction: Wallet['processingTransaction'];
  transferAllFundsToDestinationWallet: Wallet['transferAllFundsToDestinationWallet'];
}) => {
  const [isShowingConfirm, setIsShowingConfirm] = useState(false)

  const { currentTransaction } = useCurrentTransactionStatus(processingTransaction)
  const hasSufficientBalance = Number(walletBalance) >= sendThreshold

  return (
    <Transition
      on={!isShowingConfirm}
      inClass='w-[260px] h-[260px] border-slate-50 rounded-[130px] bg-black'
      outClass='bg-white w-[80%] p-5 rounded-[8px] h-[132px]'
      className='border border-dashed mx-auto balance-control'
    >
      <div className={'h-full z-10 flex'}>
        <Transition
          on={isShowingConfirm}
          unmountOnEnd
          delayIn={200}
          className='flex flex-col gap-5 text-center m-auto'
        >
          <Text as="p" size='s'>
                Send <strong>{formatFilValue(walletBalance)}</strong> to the destination address?
          </Text>
          <div className='flex gap-5 justify-center'>
            <Button
              type='button'
              variant='primary'
              onClick={() => setIsShowingConfirm(false)}
              className='bg-white text-primary'
            >
              <Text font='mono' size='2xs' color='primary'>Cancel</Text>
            </Button>
            <Button
              type='button'
              variant='primary'
              onClick={() => {
                transferAllFundsToDestinationWallet()
                setIsShowingConfirm(false)
              }}
            >
              Transfer
            </Button>
          </div>

        </Transition>

        <Transition
          on={!isShowingConfirm}
          delayIn={200}
          unmountOnEnd
          className='m-auto flex flex-col gap-5 items-center justify-center h-full'
        >
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
                  onClick={() => setIsShowingConfirm(true)}
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
        </Transition>
      </div>
    </Transition>
  )
}

export default BalanceControl
