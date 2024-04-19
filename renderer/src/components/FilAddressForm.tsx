import { FC, useState, useEffect, useRef } from 'react'
import {
  delegatedFromEthAddress,
  ethAddressFromDelegated,
  newFromString
} from '@glif/filecoin-address'
import Warning from 'src/assets/img/icons/error.svg?react'
import EditIcon from 'src/assets/img/icons/edit.svg?react'

interface FilAddressFormProps {
  destinationAddress: string | undefined;
  saveDestinationAddress: (address: string | undefined) => void;
  editMode: boolean;
  transferMode: boolean;
  enableEditMode: () => void;
}

const checkAddressString = async (address: string) => {
  if (address.startsWith('0x')) {
    delegatedFromEthAddress(address)
  } else if (address.startsWith('f4')) {
    ethAddressFromDelegated(address)
  } else if (address.startsWith('f1')) {
    newFromString(address)
  } else {
    throw new Error('Invalid address type')
  }
  const res = await fetch(`https://station-wallet-screening.fly.dev/${address}`)
  if (res.status === 403) {
    throw new Error('Sanctioned address')
  }
}

const FilAddressForm: FC<FilAddressFormProps> = ({
  destinationAddress = '',
  saveDestinationAddress,
  editMode,
  transferMode,
  enableEditMode
}) => {
  const [addressIsValid, setAddressIsValid] = useState<boolean | undefined>()
  const [inputAddr, setInputAddr] = useState<string>(destinationAddress)
  const [internalEditMode, setInternalEditMode] = useState<boolean>(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInternalEditMode(editMode || destinationAddress === '')
    setInputAddr(destinationAddress)
  }, [editMode, destinationAddress])

  useEffect(() => {
    if (internalEditMode && ref.current) {
      ref.current.focus()
      if (destinationAddress.length > 0) {
        ref.current.setSelectionRange(destinationAddress.length, destinationAddress.length)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalEditMode])

  useEffect(() => {
    if (inputAddr === '') {
      setAddressIsValid(true)
    } else {
      (async () => {
        try {
          await checkAddressString(inputAddr)
          setAddressIsValid(true)
        } catch {
          setAddressIsValid(false)
        }
      })()
    }
  }, [inputAddr])

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (addressIsValid) {
      saveDestinationAddress(inputAddr)
    }
    if (ref.current) { ref.current.blur() }
  }

  const computeBorderClasses = () => {
    const listOfClasses = `border-b-[0.5px] border-white h-[1px] border-solid ease-[cubic-bezier(0.85,0,0.15,1)]
      duration-500 ${internalEditMode ? '' : 'invisible opacity-0'}`
    if (!editMode) {
      return `${listOfClasses} border-white border-dashed`
    }
    if (internalEditMode && inputAddr === destinationAddress) {
      return listOfClasses
    }
    if (addressIsValid) {
      return `${listOfClasses} border-solid border-green-100`
    } else {
      return `${listOfClasses} border-red-200`
    }
  }

  const renderBottomMessage = () => {
    return (
      <div className='relative'>
        <div
          className={`
            absolute flex flex-row items-center mt-3 ease-[cubic-bezier(0.85,0,0.15,1)] duration-500
            ${(internalEditMode && !addressIsValid) ? 'visible' : 'invisible opacity-0'}
          `}
        >
          <Warning width={'12px'} height={'12px'} fill="#ff4d81" className='mr-1' />
          <span className="text-body-2xs text-red-200">
            The FIL address entered is invalid. Please check and try again.
          </span>
        </div>
        <p
          className={`
            absolute text-body-2xs text-white mt-3 ease-[cubic-bezier(0.85,0,0.15,1)] duration-500
            ${(internalEditMode && addressIsValid && inputAddr.startsWith('f1'))
              ? 'visible'
              : 'invisible opacity-0'
            }
          `}
        >
          Warning: Sending rewards to an f1 address incurs a higher gas fee than sending to an f4 address because
          it invokes the FilForwarder contract. Consider using an f4 address instead.
        </p>
        <p
          className={`
            absolute text-body-2xs text-white mt-3 ease-[cubic-bezier(0.85,0,0.15,1)] duration-500
            ${(internalEditMode && addressIsValid && !inputAddr.startsWith('f1'))
              ? 'visible'
              : 'invisible opacity-0'
            }
          `}
        >
          Enter a destination address for the transfer
        </p>
      </div>
    )
  }

  const renderActionButton = () => {
    return (
      <>
        <button
          className={`
            btn-primary w-40 submit-address bg-grayscale-250 text-primary ease-[cubic-bezier(0.85,0,0.15,1)]
            duration-500
            ${internalEditMode && editMode ? 'visible z-20' : 'invisible text-opacity-0 translate-y-[7.8rem]'}
          `}
          disabled={(!addressIsValid && !internalEditMode) || (inputAddr === destinationAddress)}
          title="save address"
          type="submit"
          value="connect"
          onClick={handleSubmit}
        >
          <span className="text-xs px-4">Save</span>
        </button>
        <button
          className={`
            address-edit flex flex-row items-end h-[30px] cursor-pointer group absolute mb-1 ml-4
            ease-[cubic-bezier(0.85,0,0.15,1)] duration-500
            ${destinationAddress.length > 5 ? 'left-[168px]' : 'left-[80px]'}
            ${(!internalEditMode && !transferMode) ? 'visible' : 'opacity-0'}
          `}
          tabIndex={0}
          onClick={() => enableEditMode()}
          disabled={transferMode}
        >
          <EditIcon className="btn-icon-primary mr-1" />
          <span
            className={
              'text-white hidden group-hover:block opacity-80 not-italic text-body-m font-body leading-[1.5rem]'
            }
          >
            Edit
          </span>
        </button>
      </>
    )
  }
  const renderDisplayAddress = () => {
    if (!internalEditMode) {
      if (inputAddr.length > 5) {
        return `${inputAddr.slice(0, 6)} . . . ${inputAddr.slice(inputAddr.length - 6, inputAddr.length)}`
      } else {
        return `${inputAddr.slice(0, 2)} . . . ${inputAddr.slice(inputAddr.length - 2, inputAddr.length)}`
      }
    }
    return inputAddr
  }
  return (
    <>
      <div className='relative flex w-full items-end ease-in-out pb-[15px] justify-between'>
        <div className={`relative flex flex-col mt-[20px] w-fit ${internalEditMode ? 'z-10' : 'z-0'}`}>
          <input
            ref={ref}
            spellCheck="false"
            autoComplete="off"
            type="text"
            name="address"
            placeholder=" "
            disabled={!internalEditMode}
            tabIndex={0}
            value={renderDisplayAddress()}
            onChange={(event) => { setInputAddr(event.target.value) }}
            id='destination-address'
            className={`
              destination-address input fil-address mt-[7px] min-w-[90px] w-[460px] ease-in-out transition
              duration-300
            `}
            onFocus={() => { enableEditMode() }}
          />
          <label
            htmlFor="address"
            className={`
              absolute duration-300 top-3 origin-top-lef pointer-events-none text-white opacity-80 font-body
              text-body-2xs uppercase mb-3
            `}
          >
            Destination Address</label>
          <div className={computeBorderClasses()} />
          {renderBottomMessage()}
        </div>
        {renderActionButton()}
      </div>
    </>
  )
}

export default FilAddressForm
