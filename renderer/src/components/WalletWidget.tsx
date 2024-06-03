import useWallet from 'src/hooks/StationWallet'
import WalletIcon from 'src/assets/img/icons/wallet.svg?react'
import { useDialog } from './DialogProvider'
import { formatFilValue } from 'src/lib/utils'
import Text from './Text'
import WalletModal from './WalletModal'
import { ROUTES } from 'src/lib/routes'
import TransactionStatusIndicator from './TransactionStatusIndicator'
import { useLocation } from 'react-router-dom'
import useCurrentTransactionStatus from 'src/hooks/useCurrentTransactionStatus'

const WalletWidget = () => {
  const { openDialog } = useDialog()
  const { walletBalance, processingTransaction } = useWallet()
  const { currentTransaction } = useCurrentTransactionStatus(processingTransaction)
  const { pathname } = useLocation()

  if (pathname === ROUTES.wallet) {
    return null
  }

  function handleClick () {
    openDialog({
      content: <WalletModal />
    })
  }

  return (
    <div className='absolute top-5 right-9 flex gap-5 no-drag-area'>
      <TransactionStatusIndicator transaction={currentTransaction} />
      <button
        type='button'
        onClick={handleClick}
        className={`flex items-center gap-3 text-black 
        focus-visible:outline-slate-400 focus:outline-slate-400 p-1`}
      >
        <WalletIcon />
        <Text font='mono' size='xs' bold className="text-black">{formatFilValue(walletBalance)} FIL</Text>
      </button>
    </div>
  )
}

export default WalletWidget
