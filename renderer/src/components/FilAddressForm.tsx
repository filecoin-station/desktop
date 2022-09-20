import { FormEvent, useEffect, useState } from 'react'
import { checkAddressString } from '@glif/filecoin-address'

interface IValidationError {
  message: string | undefined
}

const ValidationError: FC<IValidationError> = ({ message }) => {
  return (
    message
      ? <span className="err-msg" data-test-id="validation error" title="validation error">{message}</span>
      : <span className='mb-[0.625rem]'>&nbsp;</span>
  )
}

interface IFilAddressForm {
  showOnboarding: () => void,
  sysFilAddress: string | undefined,
  setFilAddress: (address: string | undefined) => void
}

const FilAddressForm: FC<IFilAddressForm> = ({ showOnboarding, setFilAddress, sysFilAddress }) => {
  const [validationError, setValidationError] = useState<string | undefined>()
  const [inputAddr, setInputAddr] = useState<string>('')

  const validateAddress = () => {
    setValidationError(undefined)
    try {
      checkAddressString(inputAddr)
      return true
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : '' + err)
      return false
    }
  }

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAddr(event.target.value)
  }

  const handleAuthenticate = () => {
    if (!inputAddr) {
      return true
    }
    if (validateAddress()) {
      setFilAddress(inputAddr)
    }
  }

  return (
    <div className='w-full px-6 py-4'>
      <h2 className="title text-black mb-24 font-bold text-header-xl">
        Connect to the Station with your FIL address to start <span className='text-primary'> earning FIL</span>
      </h2>
      <div className='pt-2 mb-20'>
        <div className="relative z-0 w-full">
          <input autoComplete="off"
            className="input w-full block "
            type="text"
            name="address"
            placeholder=" "
            data-testid="input-address-element"
            onChange={handleChangeAddress} />
          <label htmlFor="address"
            className="absolute duration-300 top-3 origin-top-left text-black pointer-events-none font-body uppercase">
            FIL Address</label>

          <ValidationError message={validationError} />
        </div>
      </div>

      <div className='flex justify-between items-center gap-3'>
        <p className="text-body-m">Your FIL rewards will be sent once a day to the address entered.</p>
        <button
          className="btn-primary "
          disabled={inputAddr.length === 0}
          onClick={handleAuthenticate}
          title="connect">
          <span className="text-xs px-4">Connect</span>
        </button>
      </div>
    </div>
  )
}

export default FilAddressForm
