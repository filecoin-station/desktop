import { useState, useEffect } from 'react'
import * as Sentry from '@sentry/react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from '../lib/station-config'
import { FILTransaction } from '../typings'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface Wallet {
  stationAddress: string,
  destinationFilAddress: string | undefined,
  walletBalance: string | undefined,
  walletTransactions: FILTransaction[] | undefined,
  editDestinationAddress: (address: string|undefined) => void,
  currentTransaction: FILTransaction | undefined,
  dismissCurrentTransaction: () => void
}

const useWallet = (): Wallet => {
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<string | undefined>()
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[] | undefined>()
  const [currentTransaction, setCurrentTransaction] = useState<FILTransaction>()

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
    let cleanedUp = false
    const loadStoredInfo = async () => {
      const stationWalletTransactionHistory = await getStationWalletTransactionsHistory()
      if (!cleanedUp) {
        setWalletTransactions(stationWalletTransactionHistory)
      }
    }
    ;(async () => {
      while (true) {
        if (cleanedUp) {
          break
        }
        try {
          await loadStoredInfo()
        } catch (err) {
          console.error(err)
          Sentry.captureException(err)
        }
        await sleep(10000)
      }
    })()
    return () => {
      cleanedUp = true
    }
  }, [])

  useEffect(() => {
    const updateWalletTransactionsArray = async (transactions: FILTransaction[]) => {
      const [newCurrentTransaction, ...confirmedTransactions] = transactions
      if (newCurrentTransaction.status === 'processing' || (currentTransaction && +currentTransaction.timestamp === +newCurrentTransaction.timestamp)) {
        setCurrentTransaction(newCurrentTransaction)
        setWalletTransactions(confirmedTransactions)
      } else {
        setWalletBalance(await getStationWalletBalance())
        setWalletTransactions(transactions)
      }
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

export default useWallet
