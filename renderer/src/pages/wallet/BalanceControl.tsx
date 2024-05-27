import { useState } from 'react'
import BorderedBox from 'src/components/BorderedBox'
import Button from 'src/components/Button'
import Text from 'src/components/Text'
import { formatFilValue } from 'src/lib/utils'

const BalanceControl = ({
  balance = '',
  sendThreshold,
  transfer
}: {
    balance?: string;
    sendThreshold: number;
    transfer: () => Promise<void>;
}) => {
  const [status, setStatus] = useState<'display' | 'transfer'>('display')

  const hasBalance = Number(balance) >= sendThreshold

  if (status === 'transfer') {
    return (
      <BorderedBox className='relative flex flex-col gap-5 bg-white p-5 w-[80%] mx-auto mt-[170px] text-center'>
        <Text as="p" size='s'>Send <strong>{formatFilValue(balance)}</strong> to the destination address?</Text>
        <div className='flex gap-5 justify-center'>
          <Button
            type='button'
            variant='primary'
            onClick={() => setStatus('display')}
            className='bg-white text-primary'
          >
            <Text font='mono' size='2xs' color='primary'>Cancel</Text>
          </Button>
          <Button type='button' variant='primary' onClick={transfer}>Transfer</Button>
        </div>
      </BorderedBox>
    )
  }

  return (
    <div className={`w-[260px] aspect-square mx-auto bg-black mt-[100px]
                    border border-dashed border-slate-50 rounded-full z-10`}
    >

      <div className='m-auto flex flex-col gap-5 items-center justify-center h-full'>
        <Text font="mono" size="xl" bold className="text-slate-50">
          {formatFilValue(balance)} FIL
        </Text>
        {hasBalance
          ? (
            <Button
              type='button'
              variant='primary'
              onClick={() => {
                setStatus('transfer')
              }}
            >
              Transfer
            </Button>
          )
          : (
            <Text font='mono' size='2xs' className="text-slate-50">Accruing...</Text>
          )}
      </div>
    </div>
  )
}

export default BalanceControl
