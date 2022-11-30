import { FC, useState, useEffect } from 'react'
import { FILTransaction } from '../typings'
import dayjs from 'dayjs'
import { ReactComponent as IncomeIcon } from '../assets/img/icons/income.svg'
import { ReactComponent as OutcomeIcon } from '../assets/img/icons/outcome.svg'
import { ReactComponent as ExternalLinkIcon } from '../assets/img/icons/external.svg'
import WalletTransactoinStatusWidget from './WalletTransactionStatusWidget'
import { brownseTransactionTracker } from '../lib/station-config'
import WalletOnboarding from './WalletOnboarding'

interface WalletTransactionsHistoryProps {
  allTransactions: FILTransaction[] | [],
  latestTransaction: FILTransaction | undefined
}

const WalletTransactionsHistory: FC<WalletTransactionsHistoryProps> = ({ allTransactions = [], latestTransaction }) => {
  const renderTransactionHistory = () => {
    return (
      <>
      <div className={`ease-in-out transition-all duration-1000 ${allTransactions.length > 0 ? ' fixed opacity-0 invisible translate-y-[200px]' : 'visible'}`}><WalletOnboarding /></div>
      <div className={`ease-in-out transition-all duration-1000 ${allTransactions.length > 0 ? 'visible' : ' fixed opacity-0 invisible -translate-y-[50px]'}`}>
        <p className="px-8 mb-2 w-fit text-body-3xs text-black opacity-80 uppercase">WALLET HISTORY</p>
        { allTransactions.map((transaction, index) => <div key={transaction.timestamp}><Transaction transaction={transaction} /></div>)}
      </div>
      </>
    )
  }

  return (
    <div className='transition-all duration-1000 ease-in-out'>
      <RecentTransaction transaction={latestTransaction}/>
      <div className='pt-8'>
        {renderTransactionHistory()}
      </div>
    </div>
  )
}

interface TransactionProps {
  transaction: FILTransaction | undefined
}

const RecentTransaction: FC<TransactionProps> = ({ transaction }) => {
  const [displayTransition, setDisplayTransaction] = useState<FILTransaction | undefined>({} as FILTransaction)

  useEffect(() => {
    if (transaction !== undefined) {
      setDisplayTransaction(transaction)
    }
  }, [transaction])

  return (
    <div className={`pt-8 pb-8 bg-opacity-10 h-[165px] transition-all duration-1000 ease-in-out
                  ${transaction ? 'mt-0' : '-mt-[165px]'}
                  ${displayTransition?.status === 'sent' ? 'bg-green-200' : displayTransition?.status === 'failed' ? 'bg-red-100' : 'bg-orange-100'}`}
      onTransitionEnd={() => !transaction && setDisplayTransaction(undefined)}>
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
              {displayTransition?.status === 'sent' ? 'Sent' : displayTransition?.status === 'failed' ? 'Failed to send' : 'Sending'}
              <span className='font-bold mx-1'>{displayTransition?.amount} FIL</span>
              {displayTransition?.outgoing && 'to'}
              {displayTransition?.outgoing && <span className='font-bold mx-1'>{displayTransition?.address}</span>}
            </span>
          </div>
        </div>
        <div className="ml-[97px]"> {displayTransition && <WalletTransactoinStatusWidget currentTransaction={displayTransition} renderBackground={false} />}</div>
      </div>
    </div>
  )
}

const Transaction: FC<TransactionProps> = ({ transaction }) => {
  const openExternalURL = (hash: string) => { brownseTransactionTracker(hash) }
  if (transaction) {
    return (
      <div className='px-8 hover:bg-primary hover:bg-opacity-[5%] group'>
        <div className="flex flex-row items-center justify-between py-2 border-b-[1px] border-black border-opacity-5">
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
              {transaction.outgoing && <span className='font-bold mx-1'>{transaction.address}</span>}
            </span>
          </div>
          <div className='flex invisible group-hover:visible'>
            <p className="text-body-2xs text-primary ml-2 cursor-pointer" onClick={() => openExternalURL(transaction.hash)}><i><ExternalLinkIcon /></i></p>
          </div>
        </div>
      </div>
    )
  }
  return (<></>)
}

export default WalletTransactionsHistory
