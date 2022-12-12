import { FC, useState, useEffect } from 'react'
import { checkAddressString } from '@glif/filecoin-address'
import { ReactComponent as Warning } from '../assets/img/icons/error.svg'
import { ReactComponent as EditIcon } from '../assets/img/icons/edit.svg'

interface FilAddressFormProps {
  destinationAddress: string | undefined,
  saveDestinationAddress: (address: string | undefined) => void,
  editMode: boolean,
  transferMode: boolean,
  enableEditMode: () => void
}

const FilAddressForm: FC<FilAddressFormProps> = ({ destinationAddress = '', saveDestinationAddress, editMode, transferMode, enableEditMode }) => {
  const [addressIsValid, setAddressIsValid] = useState<boolean | undefined>()
  const [inputAddr, setInputAddr] = useState<string>(destinationAddress)
  const [internalEditMode, setInternalEditMode] = useState<boolean>(false)

  useEffect(() => {
    setInternalEditMode(editMode || destinationAddress === '')
    setInputAddr(destinationAddress)
  }, [editMode, destinationAddress])

  useEffect(() => {
    if (inputAddr === '') {
      setAddressIsValid(true)
    } else {
      try {
        checkAddressString(inputAddr)
        setAddressIsValid(true)
      } catch {
        setAddressIsValid(false)
      }
    }
  }, [inputAddr])

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (addressIsValid) {
      saveDestinationAddress(inputAddr)
    }
  }

  const computeBorderClasses = () => {
    const listOfClasses = `border-b-[0.5px] border-white h-[1px] border-solid ease-[cubic-bezier(0.85,0,0.15,1)] duration-500 ${internalEditMode ? '' : 'invisible opacity-0'}`
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
        <div className={`absolute flex flex-row items-center mt-3 ease-[cubic-bezier(0.85,0,0.15,1)] duration-500 ${(internalEditMode && !addressIsValid) ? 'visible' : 'invisible opacity-0'}`}>
          <Warning width={'12px'} height={'12px'} fill="#ff4d81" className='mr-1'/>
          <span className="text-body-2xs text-red-200">The FIL address entered is invalid. Please check and try again.</span>
        </div>
        <p className={`absolute text-body-2xs text-white mt-3 ease-[cubic-bezier(0.85,0,0.15,1)] duration-500 ${(internalEditMode && addressIsValid) ? 'visible' : 'invisible opacity-0'}`}>Enter an address to receive your FIL.</p>
      </div>
    )
  }

  const renderActionButton = () => {
    return (
      <>
        <button className={`btn-primary w-40 submit-address bg-grayscale-250 text-primary ease-[cubic-bezier(0.85,0,0.15,1)] duration-700
        ${internalEditMode && editMode ? 'visible z-20' : 'invisible text-opacity-0 translate-y-[7.8rem]'}`}
          disabled={(!addressIsValid && !internalEditMode) || (inputAddr === destinationAddress)}
          title="save address" type="submit" value="connect" onClick={handleSubmit}>
          <span className="text-xs px-4">Save</span>
        </button>
        <button className={`flex flex-row items-end h-[30px] cursor-pointer group absolute mb-2 ml-4 left-[100px] ease-[cubic-bezier(0.85,0,0.15,1)] duration-500 ${(!internalEditMode && !transferMode) ? 'visible' : 'opacity-0'}`}
          tabIndex={0} onClick={() => enableEditMode()}
          disabled={transferMode}>
          <EditIcon className="btn-icon-primary mr-1" />
          <span className='text-white hidden group-hover:block opacity-80 not-italic text-body-m font-body leading-[1.5rem]'>Edit</span>
        </button>
      </>
    )
  }

  return (
    <>
      <div className='relative flex w-full items-end ease-in-out pb-[15px] justify-between'>
        <div className='relative z-0 flex flex-col mt-[20px] w-fit'>
          <input
            spellCheck="false" autoComplete="off" type="text" name="address" size={internalEditMode ? 200 : destinationAddress.length}
            placeholder=" "
            disabled={!internalEditMode}
            tabIndex={0} value={inputAddr}
            onChange={(event) => { setInputAddr(event.target.value) }}
            className='input fil-address mt-[7px] min-w-[90px] w-[460px] ease-in-out transition duration-300'
            onFocus={() => { enableEditMode() }}/>
          <label htmlFor="address"
            className="absolute duration-300 top-3 origin-top-lef pointer-events-none text-white opacity-80 font-body text-body-2xs uppercase mb-3">
            Your FIL Address</label>
          <div className={ computeBorderClasses() } />
          { renderBottomMessage() }
        </div>
        { renderActionButton() }
      </div>
    </>
  )
}

export default FilAddressForm
