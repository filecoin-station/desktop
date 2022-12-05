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

  useEffect(() => setInternalEditMode(editMode), [editMode])
  useEffect(() => { setInputAddr(destinationAddress) }, [destinationAddress])

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

  const computeInputClasses = () => {
    const listOfClasses = `input fil-address mt-[7px] min-w-[90px] w-[460px] ease-in-out transition duration-700 ${internalEditMode ? '' : 'w-fit border-opacity-0'}`
    if (inputAddr === destinationAddress || !internalEditMode) {
      return listOfClasses
    }
    if (addressIsValid) {
      return `${listOfClasses} border-solid border-green-100 focus:border-solid focus:border-green-100`
    } else {
      return `${listOfClasses} border-red-200 focus:border-red-200`
    }
  }

  const renderBottomMessage = () => {
    if (!internalEditMode) {
      return (<p className="text-body-2xs text-white mt-3 w-fit mb-[1px]">&nbsp;</p>)
    }

    if (addressIsValid) {
      return (<p className="text-body-2xs text-white mt-3">Enter an address to receive your FIL.</p>)
    }

    return (
      <div className='flex flex-row items-center mt-3'>
        <Warning width={'12px'} height={'12px'} fill="#ff4d81" />
        <span className="ml-1 text-red-200 text-body-2xs">The FIL address entered is invalid. Please check and try again.</span>
      </div>
    )
  }

  const renderActionButton = () => {
    return (
      <>
        <button className={`flex flex-row items-end h-[30px] cursor-pointer group mb-2 ml-4 ease-in-out duration-100 ${(!internalEditMode && !transferMode) ? 'delay-200 visible' : 'invisible opacity-0'}`}
          tabIndex={0} onClick={() => enableEditMode()}>
          <EditIcon className="btn-icon-primary mr-1" />
          <span className='text-white hidden group-hover:block opacity-80 not-italic text-body-m font-body leading-[1.5rem]'>Edit</span>
        </button>
        <button className={`btn-primary mb-6 submit-address bg-grayscale-250 text-primary ease-in-out duration-100 ${internalEditMode && (inputAddr !== destinationAddress || inputAddr.length > 0) ? 'delay-200 visible' : 'invisible opacity-0'}`}
          disabled={!(addressIsValid)}
          title="save address" type="submit" value="connect" onClick={handleSubmit}>
          <span className="text-xs px-4">Save Address</span>
        </button>
      </>
    )
  }

  return (
    <>
      <div className={`flex justify-between items-center ${internalEditMode ? 'w-full' : 'w-fit'}`}>
        <div className='relative z-0 flex flex-col mt-[20px] w-fit'>
          <input
            spellCheck="false" autoComplete="off" type="text" name="address" size={destinationAddress.length}
            placeholder=" "
            disabled={!internalEditMode}
            tabIndex={0} value={inputAddr}
            onChange={(event) => { setInputAddr(event.target.value) }}
            className={computeInputClasses()} />
          <label htmlFor="address"
            className="absolute duration-300 top-3 origin-top-lef pointer-events-none text-white opacity-80 font-body text-body-2xs uppercase mb-3">
            Your FIL Address</label>
          {renderBottomMessage()}
        </div>
        { renderActionButton() }
      </div>
    </>
  )
}

export default FilAddressForm
