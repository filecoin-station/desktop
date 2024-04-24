import { useState, useEffect, useCallback } from 'react'
import {
  getDestinationWalletAddress,
  setDestinationWalletAddress,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory,
  transferAllFundsToDestinationWallet
} from 'src/lib/station-config'
import {
  FILTransaction,
  FILTransactionProcessing,
  FILTransactionStatus,
  isFILTransactionConfirmed,
  isFILTransactionProcessing
} from 'src/typings'
import { ethAddressFromDelegated } from '@glif/filecoin-address'

interface Wallet {
  stationAddress: string;
  stationAddress0x: string;
  destinationFilAddress: string | undefined;
  walletBalance: string | undefined;
  walletTransactions: FILTransaction[] | undefined;
  editDestinationAddress: (address: string|undefined) => void;
  processingTransaction: FILTransactionProcessing | undefined;
  dismissCurrentTransaction: () => void;
  transferAllFundsToDestinationWallet: () => Promise<void>;
}

const useWallet = (): Wallet => {
  const [stationAddress, setStationAddress] = useState<string>('')
  const [destinationFilAddress, setDestinationFilAddress] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<string | undefined>()
  const [walletTransactions, setWalletTransactions] = useState<FILTransaction[] | undefined>()
  const [processingTransaction, setCurrentTransaction] = useState<FILTransactionProcessing | undefined>()

  const setTransactions = useCallback((
    processing: FILTransactionProcessing | undefined,
    confirmed: FILTransaction[]
  ) => {
    if (
      processingTransaction &&
      isFILTransactionProcessing(processingTransaction) &&
      !processing
    ) {
      const status: FILTransactionStatus =
        confirmed.find(tx => tx.hash === processingTransaction.hash)
          ? 'succeeded'
          : 'failed'
      const newCurrentTransaction = {
        ...processingTransaction,
        status
      }
      setCurrentTransaction(newCurrentTransaction)
      setTimeout(() => {
        setCurrentTransaction(tx =>
          tx === newCurrentTransaction
            ? undefined
            : tx
        )
      }, 10_000)
    } else if (processing) {
      setCurrentTransaction(processing)
    }
    setWalletTransactions(confirmed)
  }, [processingTransaction])

  const editDestinationAddress = async (address: string | undefined) => {
    await setDestinationWalletAddress(address)
    setDestinationFilAddress(address)
  }

  const dismissCurrentTransaction = () => {
    if (processingTransaction && processingTransaction.status !== 'processing') {
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
      const { processing, confirmed } = splitWalletTransactions(
        await getStationWalletTransactionsHistory()
      )
      setTransactions(processing, confirmed)
    }
    loadStoredInfo()
  }, [setTransactions])

  useEffect(() => {
    const updateWalletTransactionsArray = (transactions: (FILTransaction|FILTransactionProcessing)[]) => {
      const { processing, confirmed } = splitWalletTransactions(transactions)
      setTransactions(processing, confirmed)
    }

    const unsubscribeOnTransactionUpdate = window.electron.stationEvents.onTransactionUpdate(
      updateWalletTransactionsArray
    )
    return () => {
      unsubscribeOnTransactionUpdate()
    }
  }, [setTransactions])

  useEffect(() => {
    const updateWalletBalance = (balance: string) => {
      setWalletBalance(balance)
    }

    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(updateWalletBalance)
    return () => {
      unsubscribeOnBalanceUpdate()
    }
  }, [])

  useEffect(() => {
    const unsubscribeOnBalanceUpdate = window.electron.stationEvents.onBalanceUpdate(balance => {
      setWalletBalance(balance)
    })
    return () => {
      unsubscribeOnBalanceUpdate()
    }
  }, [walletBalance])

  return {
    stationAddress,
    stationAddress0x: stationAddress !== ''
      ? ethAddressFromDelegated(stationAddress)
      : '',
    destinationFilAddress,
    walletBalance,
    walletTransactions,
    editDestinationAddress,
    processingTransaction,
    dismissCurrentTransaction,
    transferAllFundsToDestinationWallet
  }
}

interface SplitTransactions {
  processing: FILTransactionProcessing | undefined;
  confirmed: FILTransaction[];
}

const splitWalletTransactions = (transactions: (FILTransaction|FILTransactionProcessing)[]): SplitTransactions => {
  return {
    processing: transactions.find(isFILTransactionProcessing),
    confirmed: transactions.filter(isFILTransactionConfirmed)
  }
}

export default useWallet
