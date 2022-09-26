import { ChangeEvent, FC, useState } from 'react'
import { checkAddressString } from '@glif/filecoin-address'

interface ValidationErrorProps {
  message: string | undefined
}

const ValidationError: FC<ValidationErrorProps> = ({ message }) => {
  return (
    message
      ? <span className="err-msg" title="validation error">{message}</span>
      : <span className='mb-[0.625rem]'>&nbsp;</span>
  )
}

interface FilAddressFormProps {
  setFilAddress: (address: string | undefined) => void
}

const FilAddressForm: FC<FilAddressFormProps> = ({ setFilAddress }) => {
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

  const handleAuthenticate = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputAddr && validateAddress()) {
      setFilAddress(inputAddr)
    }
  }

  return (

    <form onSubmit={handleAuthenticate}>
      <div className='pt-2 mb-20'>
        <div className="relative z-0 w-full">
          <input
            autoComplete="off"
            className="input w-full block fil-address"
            type="text"
            name="address"
            placeholder=" "
            tabIndex={0}
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
          className="btn-primary submit-address"
          disabled={inputAddr.length === 0}
          title="connect"
          type="submit"
          value="connect">
          <span className="text-xs px-4">Connect</span>
        </button>
      </div>
    </form>
  )
}

export default FilAddressForm
