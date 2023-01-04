import { FC, useEffect, useState } from 'react'
import { ReactComponent as InfoIcon } from '../assets/img/icons/info.svg'

interface TransferFundsButtonsProps {
  transferMode: boolean,
  balance: number,
  enableTransferMode: () => void,
  transferAllFunds: () => void,
  reset: () => void,
  destinationFilAddress: string | undefined,
  editMode: boolean
}

const TransferFundsButtons: FC<TransferFundsButtonsProps> = ({ transferMode, balance, enableTransferMode, transferAllFunds, reset, destinationFilAddress, editMode }) => {
  const [internalTransferMode, setInternalTransferMode] = useState<boolean>(false)

  useEffect(() => { setInternalTransferMode(transferMode) }, [transferMode])

  const disabled = !destinationFilAddress
  return (
    <div className={`relative flex items-end w-full ease-[cubic-bezier(0.85,0,0.15,1)] duration-700 ${(!editMode) ? 'visible' : 'z-0 -translate-y-[7.8rem] text-opacity-0 opacity-0'} ${(editMode && disabled) && 'invisible opacity-0'}`}>
      <div className={`absolute w-fit right-0 flex items-center ease-[cubic-bezier(0.85,0,0.15,1) duration-500 z-10 ${(internalTransferMode && !disabled) ? '-translate-x-[8rem] opacity-0' : ''}`}>
        <button className="btn-primary w-40 bg-grayscale-250 text-primary"
          disabled={disabled}
          onClick={enableTransferMode}>
          <span className="text-2xs px-4 text-body-s text-primary">Transfer FIL</span>
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
      <div className={`absolute w-fit right-0 flex gap-1 items-center ${internalTransferMode ? 'z-20' : 'z-0'} `}>
        <button className={`btn-primary w-40 bg-grayscale-250 text-primary ease-[cubic-bezier(0.85,0,0.15,1) duration-500 ${internalTransferMode ? '' : 'translate-x-[7.6rem] text-opacity-0 '} `}
          onClick={transferAllFunds}>
          <span className="text-2xs px-4 text-body-s">Send <span className='font-bold'>{balance} FIL</span></span>
        </button>
        <button className={`btn-primary ease-[cubic-bezier(0.85,0,0.15,1) duration-500 ${internalTransferMode ? '' : 'opacity-0'}`}
          onClick={reset}>
            <span className="text-2xs px-4 text-body-s">Cancel</span>
        </button>
      </div>
    </div>
  )
}

export default TransferFundsButtons
