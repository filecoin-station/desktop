import useWallet from 'src/hooks/StationWallet'
import { useDialog } from './DialogProvider'
import BorderedBox from './BorderedBox'
import Text from './Text'
import Address from './Address'
import { formatFilValue, openExplorerLink } from 'src/lib/utils'
import Button from './Button'
import { Link } from 'react-router-dom'
import { ROUTES } from 'src/lib/routes'
import LinkOutIcon from 'src/assets/img/icons/link-out.svg?react'
import CloseIcon from 'src/assets/img/icons/close.svg?react'
import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'
import CheckmarkIcon from 'src/assets/img/icons/checkmark.svg?react'

const WalletModal = () => {
  const {
    stationAddress,
    stationAddress0x,
    walletBalance,
    processingTransaction
  } = useWallet()
  const { closeDialog } = useDialog()
  const { status, currentTransaction } = useCurrentTransactionStatus(processingTransaction)

  return (
    <>
      <BorderedBox isGrouped className='flex p-5 justify-end'>
        <button
          onClick={closeDialog}
          type='button'
          className='focus-visible:outline-slate-400 focus:outline-slate-400'
        >
          <CloseIcon />
        </button>
      </BorderedBox>
      <BorderedBox isGrouped className='p-5'>
        <Text as='p' font='mono' size='3xs' color='primary' uppercase>&#47;&#47; Station address ... :</Text>
        <div className='flex gap-5 items-center mt-4'>
          <Address address={stationAddress} />
          <Address address={stationAddress0x} />
          <button
            type='button'
            className='text-primary ml-auto focus:outline-slate-400 w-5 h-5'
            onClick={() => openExplorerLink(stationAddress)}
          >
            <LinkOutIcon />
          </button>
        </div>
      </BorderedBox>
      <BorderedBox isGrouped className='p-5'>
        <Text as='p' font='mono' size='3xs' color='primary' uppercase>&#47;&#47; Balance ... :</Text>
        <div className='flex mt-4 items-center justify-between'>
          <Text as='p' font='mono' size='s' uppercase>
            {formatFilValue(walletBalance)} FIL
          </Text>

          {status === 'none' && (
            <Button as={Link} to={ROUTES.wallet} variant='primary' className='ml-auto pt-1 pb-1'>
                Transfer
            </Button>
          )}
          {status === 'processing' && (
            <Text as='p' size='s'>
                Sending...
            </Text>
          )}
          {status === 'complete' && (
            <div className='flex gap-3 items-center'>
              <CheckmarkIcon className='text-white fill-primary' />
              <Text as='p' size='s'>
                  {currentTransaction?.outgoing ? 'Sent' : 'Received'}
              </Text>
            </div>
          )}
        </div>
      </BorderedBox>
    </>
  )
}

export default WalletModal
