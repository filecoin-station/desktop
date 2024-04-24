import { FC, useEffect, useState } from 'react'
import useWallet from 'src/hooks/StationWallet'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'

import WalletIcon from 'src/assets/img/icons/wallet.svg?react'
import WalletTransactionStatusWidget from 'src/components/WalletTransactionStatusWidget'
import { FILTransactionProcessing } from 'src/typings'

interface WalletWidgetProps {
  onClick: () => void;
}

const WalletWidget: FC<WalletWidgetProps> = ({ onClick }) => {
  const { walletBalance, processingTransaction, dismissCurrentTransaction } = useWallet()
  const [displayTransition, setDisplayTransaction] = useState<FILTransactionProcessing|undefined>(undefined)

  useEffect(() => {
    if (processingTransaction !== undefined) {
      setDisplayTransaction(processingTransaction)
    }
  }, [processingTransaction])

  return (
    <div className="wallet-widget cursor-pointer" onClick={() => { onClick(); dismissCurrentTransaction() }}>
      <div className='flex items-center '>
        <WalletIcon />
        <span className="text-right mx-3" title="wallet">
          <span className='font-bold'>
            {new FilecoinNumber(String(walletBalance), 'fil')
              .decimalPlaces(3, BigNumber.ROUND_DOWN)
              .toString()}
          </span>
          {' '}
          FIL
        </span>
        <button type="button" className="cursor-pointer" title="logout">
          <span className="text-primary underline underline-offset-8">Open Wallet</span>
        </button>
      </div>
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
