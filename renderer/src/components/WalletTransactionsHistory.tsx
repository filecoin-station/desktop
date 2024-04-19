import { FC, useState, useEffect } from 'react'
import { FILTransaction, FILTransactionProcessing } from 'src/typings'
import dayjs from 'dayjs'
import IncomeIcon from 'src/assets/img/icons/income.svg?react'
import OutcomeIcon from 'src/assets/img/icons/outcome.svg?react'
import ExternalLinkIcon from 'src/assets/img/icons/external.svg?react'
import WalletTransactionStatusWidget from 'src/components/WalletTransactionStatusWidget'
import { browseTransactionTracker, openBeryx } from 'src/lib/station-config'
import WalletOnboarding from 'src/components/WalletOnboarding'

interface WalletTransactionsHistoryProps {
  allTransactions: FILTransaction[] | [];
  processingTransaction: FILTransactionProcessing | undefined;
}

const WalletTransactionsHistory: FC<WalletTransactionsHistoryProps> = ({
  allTransactions = [],
  processingTransaction
}) => {
  const renderTransactionHistory = () => {
    return (
      <>
        <div
          className={`
            wallet-onboarding h-[calc(100vh_-_305px)] overflow-y ease-in-out transition-all duration-1000
            ${allTransactions.length > 0 ? ' fixed opacity-0 invisible translate-y-[200px]' : 'visible'}
          `}
        >
          <WalletOnboarding />
        </div>
        <div
          className={`
            wallet-history ease-in-out transition-all duration-1000
            ${allTransactions.length > 0 ? 'visible' : ' fixed opacity-0 invisible -translate-y-[50px]'}
            ${processingTransaction ? 'h-[calc(100vh_-_470px)]' : 'h-[calc(100vh_-_305px)]'}
          `}
        >
           <p className="px-8 mb-2 w-fit text-body-3xs text-black opacity-80 uppercase">WALLET HISTORY</p>
          {allTransactions.map((transaction, index) => (
            <div className='wallet-transaction' key={transaction.hash}>
              <Transaction transaction={transaction} />
            </div>
          ))}
          <p className="p-8 text-body-2xs text-right">
            powered by <button type="button" className="underline" onClick={openBeryx}>beryx.io</button>
          </p>
        </div>
      </>
    )
  }

  return (
    <div className='transition-all duration-1000 ease-in-out'>
      <ProcessingTransaction transaction={processingTransaction} />
      <div className='pt-8 overflow-y-scroll'>
        {renderTransactionHistory()}
      </div>
    </div>
  )
}

interface ProcessingTransactionProps {
  transaction: FILTransactionProcessing | undefined;
}

const ProcessingTransaction: FC<ProcessingTransactionProps> = ({ transaction }) => {
  const [
    displayTransition,
    setDisplayTransaction
  ] = useState<FILTransactionProcessing | undefined>({} as FILTransactionProcessing)

  useEffect(() => {
    if (transaction !== undefined) {
      setDisplayTransaction(transaction)
    }
  }, [transaction])

  return (
    <div
      className={`
        pt-8 pb-8 bg-opacity-10 h-[165px] transition-all duration-1000 ease-in-out
        ${transaction ? 'mt-0' : '-mt-[165px]'}
        ${displayTransition?.status === 'succeeded'
          ? 'bg-green-200'
          : displayTransition?.status === 'failed'
            ? 'bg-red-100'
            : 'bg-orange-100'}
      `}
      onTransitionEnd={() => !transaction && setDisplayTransaction(undefined)}
    >
      <p className="px-8 mb-2 w-fit text-body-3xs text-black opacity-80 uppercase">ONGOING TRANSFER</p>
      <div className='px-8'>
        <div className="flex items-center justify-between py-2 border-b-[1px] border-black border-opacity-5">
          <div className='flex justify-start items-center gap-3'>
            {displayTransition?.outgoing
              ? <i><OutcomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
              : <i><IncomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
            }
            <span className="mr-6 text-body-2xs text-black opacity-60 font-number">
              {dayjs(displayTransition?.timestamp).format('HH:MM')}
            </span>
            <span className='text-body-s text-black'>
              {displayTransition?.status === 'succeeded'
                ? 'Sent'
                : displayTransition?.status === 'failed'
                  ? 'Failed to send'
                  : 'Sending'}
              <span className='font-bold mx-1'>{displayTransition?.amount} FIL</span>
              {displayTransition?.outgoing && 'to'}
              {displayTransition?.outgoing && (
                <span className='font-bold mx-1'>
                  {displayTransition?.address.slice(0, 6)} &hellip; {displayTransition?.address.slice(-6)}
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="ml-[97px]">
          {displayTransition && (
            <WalletTransactionStatusWidget processingTransaction={displayTransition} renderBackground={false} />
          )}
        </div>
      </div>
    </div>
  )
}

interface TransactionProps {
  transaction: FILTransaction | undefined;
}

const Transaction: FC<TransactionProps> = ({ transaction }) => {
  const openExternalURL = (hash: string) => { browseTransactionTracker(hash) }
  if (transaction) {
    return (
      <div className='px-8 hover:bg-primary hover:bg-opacity-[5%] group'>
        <div
          className="flex flex-row items-center justify-between py-2 border-b-[1px] border-black border-opacity-5"
        >
          <div className='flex justify-start items-center gap-3'>
            {transaction.outgoing
              ? <i><OutcomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
              : <i><IncomeIcon className="btn-icon-primary-small m-auto w-[12px] h-[12px]" /></i>
            }
            <span className="mr-6 text-body-2xs text-black opacity-60 font-number">
              {dayjs(transaction.timestamp).format('DD/MM/YYYY')}
            </span>
            <span className='text-body-s text-black'>
              {transaction.outgoing ? 'Sent' : 'Received'}
              <span className='font-bold mx-1'>{transaction.amount} FIL</span>
              {transaction.outgoing && 'to'}
              {transaction.outgoing && (
                <span className='font-bold mx-1'>
                  {transaction.address.slice(0, 6)} &hellip; {transaction.address.slice(-6)}
                </span>
              )}
            </span>
          </div>
          <div className='flex invisible group-hover:visible'>
            <p
              className="text-body-2xs text-primary ml-2 cursor-pointer"
              onClick={() => openExternalURL(transaction.hash)}
            >
              <i><ExternalLinkIcon /></i>
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (<></>)
}

export default WalletTransactionsHistory
