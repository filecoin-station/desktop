import { useEffect, useRef, useState } from 'react'
import { FILTransactionProcessing } from '../../../shared/typings'

const useCurrentTransactionStatus = (transaction?: FILTransactionProcessing) => {
  const [currentTransaction, setCurrentTransaction] = useState<FILTransactionProcessing>()
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (transaction) {
      setCurrentTransaction(transaction)
    } else if (!transaction) {
      timeout.current = setTimeout(() => {
        setCurrentTransaction(undefined)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout.current)
    }
  }, [transaction])

  return {
    currentTransaction
  }
}

export default useCurrentTransactionStatus
