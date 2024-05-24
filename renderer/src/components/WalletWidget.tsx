import { useEffect, useState } from 'react'
import useWallet from 'src/hooks/StationWallet'
import WalletIcon from 'src/assets/img/icons/wallet.svg?react'
import WalletTransactionStatusWidget from 'src/components/WalletTransactionStatusWidget'
import { FILTransactionProcessing } from 'src/typings'
import { useDialog } from './DialogProvider'
import { formatFilValue, openExplorerLink, truncateString } from 'src/lib/utils'
import { Link } from 'react-router-dom'
import { ROUTES } from 'src/lib/routes'

const WalletModalContent = () => {
  const {
    stationAddress,
    stationAddress0x,
    walletBalance,
    processingTransaction
  } = useWallet()

  return (
    <div>
      <p>Station address</p>
      <div className='flex gap-4 mb-4'>
        <p>{truncateString(stationAddress)}</p>
        <p>{truncateString(stationAddress0x)}</p>
      </div>
      <div>
        <p>Balance</p>
        <div className='flex justify-between'>
          {formatFilValue(walletBalance)} FIL
          <Link to={ROUTES.wallet}>Transfer</Link>
        </div>
        {processingTransaction && (
          <div className='flex justify-between'>
            <p>
              {processingTransaction.outgoing ? 'Sending' : 'Receiving'}{' '}
              {formatFilValue(processingTransaction.amount)}{' '}FIL
            </p>
            {processingTransaction.hash && (
              <button
                type='button'
                onClick={() => openExplorerLink(processingTransaction.hash)}
              >
                View on explorer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const WalletWidget = () => {
  const { openDialog } = useDialog()
  const { walletBalance, processingTransaction } = useWallet()
  const [displayTransition, setDisplayTransaction] = useState<FILTransactionProcessing|undefined>(undefined)

  useEffect(() => {
    if (processingTransaction !== undefined) {
      setDisplayTransaction(processingTransaction)
    }
  }, [processingTransaction])

  function handleClick () {
    openDialog({
      content: <WalletModalContent />
    })
  }

  return (
    <div className="flex cursor-pointer no-drag-area z-20 absolute">
      <button type='button' onClick={handleClick} className='flex items-center wallet-widget'>
        <WalletIcon />
        <span className="text-right mx-3" title="wallet">
          <span className='font-bold'>
            {formatFilValue(walletBalance)}
          </span>
          {' '}
          FIL
        </span>
      </button>
      <div
        className={`
          transition duration-1000 ease-in-out opacity-0 ${processingTransaction ? 'opacity-100' : 'opacity-0'}
        `}
        onTransitionEnd={() => !processingTransaction && setDisplayTransaction(undefined)}
      >
        {displayTransition && (
          <WalletTransactionStatusWidget processingTransaction={displayTransition} renderBackground={true} />
        )}
      </div>
    </div>
  )
}

export default WalletWidget
