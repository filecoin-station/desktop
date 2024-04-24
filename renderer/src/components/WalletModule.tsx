import { FC, useEffect, useState } from 'react'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'
import HeaderBackgroundImage from 'src/assets/img/header-curtain.png'

import FilAddressForm from 'src/components/FilAddressForm'
import WalletTransactionsHistory from 'src/components/WalletTransactionsHistory'
import useWallet from 'src/hooks/StationWallet'
import TransferFundsButtons from 'src/components/TransferFunds'
import CopyIcon from 'src/assets/img/icons/copy.svg?react'

interface PropsWallet {
  isOpen: boolean;
}

const WalletModule: FC<PropsWallet> = ({ isOpen = false }) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [transferMode, setTransferMode] = useState<boolean>(false)
  const {
    stationAddress,
    stationAddress0x,
    destinationFilAddress,
    walletBalance,
    walletTransactions,
    editDestinationAddress,
    processingTransaction,
    dismissCurrentTransaction,
    transferAllFundsToDestinationWallet
  } = useWallet()

  useEffect(() => {
    dismissCurrentTransaction()
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const reset = () => {
    setEditMode(false)
    setTransferMode(false)
  }

  const enableEditMode = () => {
    setEditMode(true)
    setTransferMode(false)
  }

  const enableTransferMode = () => {
    setEditMode(false)
    setTransferMode(true)
  }

  const saveAddress = async (address: string | undefined) => {
    editDestinationAddress(address)
    reset()
  }

  const transferAllFunds = async () => {
    setTransferMode(false)
    await transferAllFundsToDestinationWallet()
  }

  return (
    <div className='relative z-20'>
      <div className='h-8 bg-primary-dark flex items-center px-8'>
        <p className='text text-body-3xs text-white opacity-80 mr-3'>STATION ADDRESS</p>
        <p className='station-address text text-body-3xs text-white'>
          {' '}
          {stationAddress.slice(0, 6)}
          {' '}. . .{' '}
          {stationAddress.slice(stationAddress.length - 6, stationAddress.length)}
        </p>
        <button
          className={'h-full w-auto flex flex-row items-center justify-start group ml-2 mr-2 cursor-pointer'}
          tabIndex={0}
          onClick={() => navigator.clipboard.writeText(stationAddress) }
        >
          <CopyIcon className="btn-icon-primary mr-1 h-[12px] opacity-80 group-hover:opacity-100" />
        </button>
        <p className='station-address text text-body-3xs text-white'>
          {' '}
          {stationAddress0x.slice(0, 6)}
          {' '}. . .{' '}
          {stationAddress0x.slice(stationAddress0x.length - 6, stationAddress0x.length)}
        </p>
        <button
          className={'h-full w-auto flex flex-row items-center justify-start group ml-2 cursor-pointer'}
          tabIndex={1}
          onClick={() => navigator.clipboard.writeText(stationAddress0x) }
        >
          <CopyIcon className="btn-icon-primary mr-1 h-[12px] opacity-80 group-hover:opacity-100" />
        </button>
      </div>
      <div
        className='relative h-60 bg-primary bg-no-repeat bg-center z-20'
        style={{ backgroundImage: `url(${HeaderBackgroundImage})` }}
      >
        <div className="flex flex-col justify-between h-full px-6 pt-6 pb-8">
          <div className="flex flex-row justify-between align-baseline" onClick={() => setTransferMode(false)}>
            <div className='w-full'>
              <FilAddressForm
                destinationAddress={destinationFilAddress}
                saveDestinationAddress={saveAddress}
                editMode={editMode}
                transferMode={transferMode}
                enableEditMode={enableEditMode}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between align-baseline" onClick={() => setEditMode(false)}>
            <div>
              <p className="w-fit text-body-3xs text-white opacity-80 uppercase leading-none">Total FIL</p>
              <p className="wallet-balance w-fit text-header-m text-white font-bold font-number leading-none">
                {new FilecoinNumber(String(walletBalance), 'fil')
                  .decimalPlaces(3, BigNumber.ROUND_DOWN)
                  .toString()}
                <span className="text-header-3xs ml-3">FIL</span>
              </p>
            </div>
            <TransferFundsButtons
              transferMode={transferMode}
              balance={walletBalance}
              enableTransferMode={enableTransferMode}
              transferAllFunds={transferAllFunds}
              reset={reset}
              destinationFilAddress={destinationFilAddress}
              editMode={editMode}
              hasCurrentTransaction={processingTransaction !== undefined}
            />
          </div>
        </div>
      </div>
      <div className="pb-6">
        {walletTransactions && (
          <WalletTransactionsHistory
            allTransactions={walletTransactions}
            processingTransaction={processingTransaction}
          />
        )}
      </div>
    </div>
  )
}

export default WalletModule
