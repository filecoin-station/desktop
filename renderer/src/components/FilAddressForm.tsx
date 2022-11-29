import { FC, useState, SyntheticEvent, useEffect } from 'react'
import { checkAddressString } from '@glif/filecoin-address'
import { ReactComponent as Warning } from '../assets/img/icons/error.svg'

interface FilAddressFormProps {
  destinationAddress: string | undefined,
  saveDestinationAddress: (address: string | undefined) => void,
  editMode: boolean
}

const FilAddressForm: FC<FilAddressFormProps> = ({ destinationAddress = '', saveDestinationAddress, editMode }) => {
  const [addressIsValid, setAddressIsValid] = useState<boolean | undefined>()
  const [inputAddr, setInputAddr] = useState<string>(destinationAddress)

  useEffect(() => { setInputAddr(destinationAddress) }, [editMode, destinationAddress])

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

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (addressIsValid) {
      saveDestinationAddress(inputAddr)
    }
  }

  const computeInputClasses = () => {
    const listOfClasses = 'input w-full block fil-address mt-[7px]'
    if (inputAddr === destinationAddress) {
      return listOfClasses
    }
    if (addressIsValid) {
      return `${listOfClasses} border-solid border-green-100 focus:border-solid focus:border-green-100`
    } else {
      return `${listOfClasses} border-red-200 focus:border-red-200`
    }
  }

  const renderBottomMessage = () => {
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

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex justify-between items-center">
        <div className="relative z-0 w-[460px] flex flex-col mt-[20px]">
          <input
            spellCheck="false" autoComplete="off" type="text" name="address"
            placeholder=" "
            tabIndex={0} value={inputAddr}
            onChange={(event) => { setInputAddr(event.target.value) }}
            className={computeInputClasses()} />
          <label htmlFor="address"
            className="absolute duration-300 top-3 origin-top-lef pointer-events-none text-white opacity-80 font-body text-body-2xs uppercase mb-3">
            Your FIL Address</label>
          {renderBottomMessage()}
        </div>
        {(inputAddr !== destinationAddress || inputAddr.length > 0) &&
          <button
            className="btn-primary mb-6 submit-address bg-grayscale-250 text-primary"
            disabled={!(addressIsValid)}
            title="save address" type="submit" value="connect">
            <span className="text-xs px-4">Save Address</span>
          </button>
        }
      </form>
    </>
  )
}

export default FilAddressForm
