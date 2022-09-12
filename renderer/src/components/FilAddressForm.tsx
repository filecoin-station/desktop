import { FC, ChangeEvent, useState } from 'react'
import { checkAddressString } from '@glif/filecoin-address'

interface IValidationError {
  message: string | undefined
}

const ValidationError: FC<IValidationError> = ({ message }) => {
  return (
    <span className="text-red-400 text-xs" data-test-id="validation error" title="validation error">{message}</span>
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
    <div className='w-full max-w-2xl px-6 py-4'>
      <h2 className="title text-white mb-3 font-bold">
        Connect to the Station with your Filecoin Address to start <span className='text-accent'> earn FIL</span>
      </h2>

      <div className="relative z-0 w-full my-5">
        <input autoComplete="off"
          className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none
           focus:ring-0 focus:border-white border-gray-200 font-body"
          type="text" 
          name="address"
          placeholder=" "
          data-testid="input-address-element"
          onChange={handleChangeAddress} />
        <label htmlFor="address" 
        className="absolute duration-300 top-3 origin-top-left text-white pointer-events-none font-body uppercase">
          FIL Address</label>
      
      {validationError ? <ValidationError message={validationError} /> : <br />}
      </div>

      <div className='flex justify-between mt-3'>
        <button className="underline text-body-s text-left"
        onClick={showOnboarding}>How to get started?</button>
        <button
          className="btn-primary btn-primary-accent "
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
