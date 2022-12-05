import { FC } from 'react'
import { ReactComponent as InfoIcon } from '../assets/img/icons/info.svg'

interface TransferFundsButtonsProps {
  transferMode: boolean,
  balance: number,
  enableTransferMode: () => void,
  transferAllFunds: () => void,
  disabled: boolean,
  reset: () => void
}

const TransferFundsButtons: FC<TransferFundsButtonsProps> = ({ transferMode, balance, enableTransferMode, transferAllFunds, disabled, reset }) => {
  return (
    <div className='relative flex items-end w-full'>
        <div className={`absolute w-fit right-0 flex gap-1 items-center transition delay-700 ${transferMode ? 'block' : 'invisible'}`}>
          <button className={`btn-primary bg-grayscale-250 text-primary ease-in-out duration-500 ${transferMode ? '' : 'translate-x-[83%] opacity-0 bg-transparent text-white'}`}
            onClick={transferAllFunds}>
            <span className="text-2xs px-4 text-body-s">Send <span className='font-bold'>{balance} FIL</span></span>
          </button>
          <button className={`btn-primary  ease-in-out duration-100 ${transferMode ? 'delay-100' : 'opacity-0 bg-transparent text-white'}`}
          onClick={reset}>
            <span className="text-2xs px-4 text-body-s">Cancel</span>
          </button>
        </div>
        <div className={`absolute w-fit right-0 flex items-center ${transferMode ? 'invisible opacity-0 duration-150' : 'delay-200 block'}`}>
          <button className="btn-primary bg-transparent text-white border border-white border-solid border-1"
            disabled={disabled}
            onClick={enableTransferMode}>
            <span className="text-2xs px-4 text-body-s">Transfer FIL</span>
          </button>
          {disabled &&
            <div className="absolute -left-[13px] mb-[1px] hover:-left-[89px] hover:-top-[69.5px] flex flex-col items-center group">
              <div className='w-44 px-2 py-4 mb-[13px] rounded-lg bg-grayscale-200 hidden group-hover:block'>
                <p className='text-body-2xs text-center'>We need a FIL address to transfer your FIL</p>
              </div>
              <InfoIcon className="fill-grayscale-400" width={'24px'} height={'24px'} />
            </div>
          }
        </div>
    </div>
  )
}

export default TransferFundsButtons
