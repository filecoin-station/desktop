import useWallet from 'src/hooks/StationWallet'
import WalletIcon from 'src/assets/img/icons/wallet.svg?react'
import { useDialog } from './DialogProvider'
import { formatFilValue } from 'src/lib/utils'
import Text from './Text'
import WalletModal from './WalletModal'
import classNames from 'classnames'
import { ROUTES } from 'src/lib/routes'
import TransactionStatusIndicator from './TransactionStatusIndicator'

const WalletWidget = () => {
  const { openDialog } = useDialog()
  const { walletBalance, processingTransaction } = useWallet()

  function handleClick () {
    openDialog({
      content: <WalletModal />
    })
  }

  const classNameForPage = (rest?: string) =>
    classNames(rest, window.location.pathname === ROUTES.wallet ? 'text-white' : 'text-black')

  return (
    <div className='absolute top-5 right-9 flex items-center gap-2'>
      <TransactionStatusIndicator transaction={processingTransaction} />
      <button
        type='button'
        onClick={handleClick}
        className={classNameForPage(`flex items-center gap-3 no-drag-area z-10 
      focus-visible:outline-slate-400 focus:outline-slate-400 p-1`)}
      >
        <WalletIcon />
        <Text font='mono' size='xs' bold className={classNameForPage()}>{formatFilValue(walletBalance)} FIL</Text>
      </button>
    </div>
  )
}

export default WalletWidget
