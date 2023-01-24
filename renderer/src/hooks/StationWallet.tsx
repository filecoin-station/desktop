import { useState, useEffect } from 'react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from '../lib/station-config'
import { FILTransaction, FILTransactionProcessing } from '../typings'

interface Wallet {
  stationAddress: string,
  destinationFilAddress: string | undefined,
  walletBalance: string | undefined,
  walletTransactions: FILTransaction[] | undefined,
  editDestinationAddress: (address: string|undefined) => void,
  currentTransaction: FILTransactionProcessing | undefined,
  dismissCurrentTransaction: () => void
}

const useWallet = (): Wallet => {
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<string | undefined>()
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[] | undefined>()
  const [currentTransaction, setCurrentTransaction] = useState<FILTransactionProcessing>()

  const editDestinationAddress = async (address: string | undefined) => {
    await setDestinationWalletAddress(address)
    setDestinationFilAddress(address)
  }

  const dismissCurrentTransaction = () => {
    if (currentTransaction && currentTransaction.status !== 'processing') {
      setCurrentTransaction(undefined)
    }
  }

  useEffect(() => {
    const loadStoredInfo = async () => {
      setDestinationFilAddress(await getDestinationWalletAddress())
    }
    loadStoredInfo()
  }, [destinationFilAddress])

  useEffect(() => {
    const loadStoredInfo = async () => {
      setStationAddress(await getStationWalletAddress())
    }
    loadStoredInfo()
  }, [stationAddress])

  useEffect(() => {
    const loadStoredInfo = async () => {
      setWalletBalance(await getStationWalletBalance())
    }
    loadStoredInfo()
    const interval = setInterval(loadStoredInfo, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadStoredInfo = async () => {
      const { processing, confirmed } = splitWalletTransactions(
        await getStationWalletTransactionsHistory()
      )
      setCurrentTransaction(processing)
      setWalletTransactions(confirmed)
    }
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const updateWalletTransactionsArray = async (transactions: (FILTransaction|FILTransactionProcessing)[]) => {
      const { processing, confirmed } = splitWalletTransactions(transactions)
      setCurrentTransaction(processing)
      setWalletTransactions(confirmed)
    }

    const unsubscribeOnTransactionUpdate = window.electron.stationEvents.onTransactionUpdate(updateWalletTransactionsArray)
    return () => {
      unsubscribeOnTransactionUpdate()
    }
  }, [currentTransaction])

  useEffect(() => {
    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(balance => setWalletBalance(balance))
    return () => {
      unsubscribeOnBalanceUpdate()
    }
  }, [walletBalance])

  return { stationAddress, destinationFilAddress, walletBalance, walletTransactions, editDestinationAddress, currentTransaction, dismissCurrentTransaction }
}

interface SplitTransactions {
  processing: FILTransactionProcessing | undefined,
  confirmed: FILTransaction[]
}

const splitWalletTransactions = (transactions: (FILTransaction|FILTransactionProcessing)[]): SplitTransactions => {
  const processing: FILTransactionProcessing | null =
  transactions.filter(tx => tx.status === 'processing')[0] as FILTransactionProcessing
  const confirmed: FILTransaction[] =
  transactions.filter(tx => tx.status !== 'processing') as FILTransaction[]
  return { processing, confirmed }
}

export default useWallet
