import { useEffect, useRef, useState } from 'react'
import { FILTransactionProcessing } from '../../../shared/typings'

const useCurrentTransactionStatus = (transaction?: FILTransactionProcessing) => {
  const [status, setStatus] = useState<'none' | 'processing' | 'complete'>('none')
  const [currentTransaction, setCurrentTransaction] = useState<FILTransactionProcessing>()
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (transaction) {
      setStatus('processing')
      setCurrentTransaction(transaction)
    } else if (!transaction && status === 'processing') {
      setStatus('complete')

      timeout.current = setTimeout(() => {
        setStatus('none')
        setCurrentTransaction(undefined)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction])

  return {
    status,
    currentTransaction
  }
}

export default useCurrentTransactionStatus
