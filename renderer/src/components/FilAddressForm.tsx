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
      <h1 className="font-bold text-4xl mb-3">
        Connect to the Station with your Filcoin Address to start <span className='text-neutral-500'> earn FIL</span>
      </h1>

      <p className="text-gray-700 text-sm">
        Connect Station to your Filecoin wallet
      </p>
      {sysFilAddress}
      <label className="relative block mt-3">
        <span className="sr-only">Address</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 40 40">
            <path fillRule="evenodd" d="M21.9,17.6l-0.6,3.2l5.7,0.8l-0.4,1.5L21,22.3c-0.4,1.3-0.6,2.7-1.1,3.9c-0.5,1.4-1,2.8-1.6,4.1  c-0.8,1.7-2.2,2.9-4.1,3.2c-1.1,0.2-2.3,0.1-3.2-0.6c-0.3-0.2-0.6-0.6-0.6-0.9c0-0.4,0.2-0.9,0.5-1.1c0.2-0.1,0.7,0,1,0.1  c0.3,0.3,0.6,0.7,0.8,1.1c0.6,0.8,1.4,0.9,2.2,0.3c0.9-0.8,1.4-1.9,1.7-3c0.6-2.4,1.2-4.7,1.7-7.1v-0.4L13,21.1l0.2-1.5l5.5,0.8  l0.7-3.1l-5.7-0.9l0.2-1.6l5.9,0.8c0.2-0.6,0.3-1.1,0.5-1.6c0.5-1.8,1-3.6,2.2-5.2s2.6-2.6,4.7-2.5c0.9,0,1.8,0.3,2.4,1  c0.1,0.1,0.3,0.3,0.3,0.5c0,0.4,0,0.9-0.3,1.2c-0.4,0.3-0.9,0.2-1.3-0.2c-0.3-0.3-0.5-0.6-0.8-0.9C26.9,7.1,26,7,25.3,7.7  c-0.5,0.5-1,1.2-1.3,1.9c-0.7,2.1-1.2,4.3-1.9,6.5l5.5,0.8l-0.4,1.5L21.9,17.6" />
          </svg>
        </span>

        <input autoComplete="off"
          className="placeholder:normal block placeholder:text-gray-400 bg-white w-full border border-gray-400 py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-gray-900 focus:ring-gray-900 focus:ring-1 sm:text-sm"
          placeholder="FIL Address"
          type="text" name="address"
          data-testid="input-address-element"
          onChange={handleChangeAddress} />
      </label>

      {validationError ? <ValidationError message={validationError} /> : <br />}

      <div className='flex justify-between mt-3'>
        <button className="underline text-xs text-left" onClick={showOnboarding}>How to get started?</button>
        <button
          className="bg-gray-800 hover:bg-gray-900 text-neutral-50 py-2 px-4 inline-flex items-center disabled:bg-gray-400"
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
