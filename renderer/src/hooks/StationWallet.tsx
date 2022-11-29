import { useState, useEffect } from 'react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from '../lib/station-config'
import { FILTransaction } from '../typings'

interface Wallet {
  stationAddress: string,
  destinationFilAddress: string | undefined,
  walletBalance: number,
  walletTransactions: FILTransaction[] | [],
  editDestinationAddress: (address: string|undefined) => void,
  currentTransaction: FILTransaction | undefined,
  dismissCurrentTransaction: () => void
}

const useWallet = (): Wallet => {
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[]>([])
  const [currentTransaction, setCurrentTransaction] = useState<FILTransaction | undefined>()

  const editDestinationAddress = async (address: string | undefined) => {
    await setDestinationWalletAddress(address)
    setDestinationFilAddress(address)
  }

  const dismissCurrentTransaction = () => {
    if (currentTransaction && currentTransaction.status !== 'processing') {
      setWalletTransactions([currentTransaction, ...walletTransactions])
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
  }, [])

  useEffect(() => {
    const loadStoredInfo = async () => {
      setWalletTransactions(await getStationWalletTransactionsHistory())
    }
    loadStoredInfo()
  }, [])

  useEffect(() => {
    const updateWalletTransactionsArray = (transactions: FILTransaction[]) => {
      const newCurrentTransaction = transactions[0]
      if (newCurrentTransaction.status === 'processing' || (currentTransaction && +currentTransaction.timestamp === +newCurrentTransaction.timestamp)) {
        setCurrentTransaction(newCurrentTransaction)
        if (newCurrentTransaction.status !== 'processing') { setTimeout(() => { setWalletTransactions(transactions); setCurrentTransaction(undefined) }, 6000) }

        const transactionsExceptLatest = transactions.filter((t) => { return t !== newCurrentTransaction })
        setWalletTransactions(transactionsExceptLatest)
      } else {
        setWalletTransactions(transactions)
      }
    }

    const unsubscribeOnTransactionUpdate = window.electron.stationEvents.onTransactionUpdate(updateWalletTransactionsArray)
    return () => {
      unsubscribeOnTransactionUpdate()
    }
  }, [currentTransaction])

  useEffect(() => {
    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(setWalletBalance)
    return () => {
      unsubscribeOnBalanceUpdate()
    }
  }, [walletBalance])

  return { stationAddress, destinationFilAddress, walletBalance, walletTransactions, editDestinationAddress, currentTransaction, dismissCurrentTransaction }
}

export default useWallet
