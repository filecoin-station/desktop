import { FC, useEffect, useState } from 'react'
import HeaderBackgroundImage from '../assets/img/header-curtain.png'

import FilAddressForm from './FilAddressForm'
import WalletTransactionsHistory from './WalletTransactionsHistory'
import useWallet from '../hooks/StationWallet'
import TransferFundsButtons from './TransferFunds'
import { transferAllFundsToDestinationWallet } from '../lib/station-config'

interface PropsWallet {
  isOpen: boolean,
}

const WalletModule: FC<PropsWallet> = ({ isOpen = false }) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [transferMode, setTransferMode] = useState<boolean>(false)
  const { stationAddress, destinationFilAddress, walletBalance, walletTransactions, editDestinationAddress, currentTransaction, dismissCurrentTransaction } = useWallet()

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
    await transferAllFundsToDestinationWallet()
    setTransferMode(false)
  }

  const renderTransferButtons = () => {
    return (
      <TransferFundsButtons
        transferMode={transferMode}
        balance={walletBalance}
        enableTransferMode={enableTransferMode}
        transferAllFunds={transferAllFunds}
        reset={reset}
        destinationFilAddress={destinationFilAddress}
        editMode={editMode} />
    )
  }

  return (
    <div className='relative z-20'>
      <div className='h-8 bg-primary-dark flex items-center px-8' onClick={reset}>
        <p className='text text-body-3xs text-white opacity-80 mr-3'>STATION ADDRESS</p>
        <p className='text text-body-3xs text-white'>{stationAddress}</p>
      </div>
      <div className='relative h-60 bg-primary bg-no-repeat bg-center z-20' style={{ backgroundImage: `url(${HeaderBackgroundImage})` }}>
        <div className="flex flex-col justify-between h-full px-6 pt-6 pb-8">
          <div className="flex flex-row justify-between align-baseline" onClick={() => setTransferMode(false)}>
            <div className='w-full'>
              <FilAddressForm destinationAddress={destinationFilAddress} saveDestinationAddress={saveAddress}
              editMode={editMode} transferMode={transferMode} enableEditMode={enableEditMode}/>
            </div>
          </div>
          <div className="flex flex-row justify-between align-baseline" onClick={() => setEditMode(false) }>
            <div>
              <p className="w-fit text-body-3xs text-white opacity-80 uppercase leading-none">Total FIL</p>
              <p className="w-fit text-header-m text-white font-bold font-number leading-none">
                {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 3 })}<span className="text-header-3xs ml-3">FIL</span>
              </p>
            </div>
            { renderTransferButtons() }
          </div>
        </div>
      </div>
      <div className="pb-6">
        <WalletTransactionsHistory allTransactions={walletTransactions} latestTransaction={currentTransaction}/>
      </div>
    </div>
  )
}

export default WalletModule
