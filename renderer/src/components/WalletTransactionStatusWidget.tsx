import { FC } from 'react'
import SentIcon from 'src/assets/img/icons/sent.svg?react'
import FailedIcon from 'src/assets/img/icons/failed.svg?react'
import ProcessingIcon from 'src/assets/img/icons/processing.svg?react'
import { FILTransaction, FILTransactionProcessing } from 'src/typings'
import { browseTransactionTracker } from 'src/lib/station-config'

interface WalletTransactionStatusWidgetProps {
  processingTransaction: FILTransactionProcessing | FILTransaction;
  renderBackground: boolean;
}

const WalletTransactionStatusWidget: FC<WalletTransactionStatusWidgetProps> = ({
  processingTransaction,
  renderBackground = true
}) => {
  const openExternalURL = (hash: string) => {
    browseTransactionTracker(hash)
  }

  const hash = processingTransaction?.hash

  if (processingTransaction?.status === 'succeeded') {
    return (
      <div
        className={`
          w-fit rounded-[2px] mt-3 pl-2 pr-4 flex items-center gap-2 transition-all duration-700 ease-in-out
          ${renderBackground && 'bg-green-200 bg-opacity-10'}
        `}
      >
        <SentIcon width={14} height={14} />
        <span className=' text-body-s text-green-200'>Sent</span>
      </div>
    )
  } else if (processingTransaction?.status === 'processing') {
    return (
      <div
        className={`
          w-fit rounded-[2px] mt-3 pl-2 pr-4 flex items-center gap-2 transition-all duration-700 ease-in-out
          ${renderBackground && 'bg-[#F5C451] bg-opacity-10'}
        `}
      >
        <ProcessingIcon width={14} height={14} />
        <span className=' text-body-s text-[#F3AE0C]'>Processingsrc.</span>
      </div>
    )
  } else if (processingTransaction?.status === 'failed') {
    return (
      <div
        className={`w-fit rounded-[2px] mt-3 pl-2 pr-4 flex items-center gap-2 justify-start transition-all
          duration-700 ease-in-out ${renderBackground && 'bg-red-100 bg-opacity-10'}
        `}
      >
        <FailedIcon width={14} height={14}/>
        <span className=' text-body-s text-red-100'>Failed</span>
        {hash && (
          <p
            className="text-body-2xs text-red-100 underline ml-2 opacity-80 cursor-pointer"
            onClick={() => openExternalURL(hash)}
          >
            View Transaction
          </p>
        )}
      </div>
    )
  }

  return (<></>)
}

export default WalletTransactionStatusWidget
