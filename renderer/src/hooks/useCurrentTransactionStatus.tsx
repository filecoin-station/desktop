import { useEffect, useRef, useState } from 'react'
import { FILTransactionProcessing } from '../../../shared/typings'

const useCurrentTransactionStatus = (transaction?: FILTransactionProcessing) => {
  const [status, setStatus] = useState<'none' | 'processing' | 'complete'>('none')
  const [currentTransaction, setCurrentTransaction] = useState<FILTransactionProcessing>()
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const statusRef = useRef<typeof status>('none')

  statusRef.current = status

  useEffect(() => {
    if (transaction) {
      setStatus('processing')
      setCurrentTransaction(transaction)
    } else if (!transaction && statusRef.current === 'processing') {
      setStatus('complete')

      timeout.current = setTimeout(() => {
        setStatus('none')
        setCurrentTransaction(undefined)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout.current)
    }
  }, [transaction])

  return {
    status,
    currentTransaction
  }
}

export default useCurrentTransactionStatus
