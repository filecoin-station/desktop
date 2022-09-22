import { FormEvent, useEffect, useState } from 'react'
import { checkAddressString } from '@glif/filecoin-address'

interface FilAddressFormProps {
    address?: string
    setAddress: React.Dispatch<React.SetStateAction<string | undefined>>
    onValidAddress: (address: string) => void
}

export default function FilAddressForm (props: FilAddressFormProps) {
  const backendAddress = props.address ?? ''
  const [address, setAddress] = useState(backendAddress)
  const [validationError, setValidationError] = useState<string | undefined>()

  const validateAddress = () => {
    setValidationError(undefined)
    if (!address) return true
    try {
      checkAddressString(address)
      return true
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : '' + err)
      return false
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateAddress() && address !== props.address) {
      props.onValidAddress(address)
    }
  }

  // Update the input element with the address after it was loaded from the backend
  useEffect(() => { setAddress(backendAddress) }, [backendAddress])

  // Validate the address entered by the user
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { validateAddress() }, [address])

  return (
    <form onSubmit={handleSubmit}>
        <input
            className='fil-address'
            value={address}
            placeholder="Enter FIL address"
            onChange={e => setAddress(e.target.value)}
            autoFocus={true}
            required/>
        <button type='submit' className='submit-address'>Go!</button>
        <p className='error' style={{ visibility: validationError ? 'visible' : 'hidden' }}>
          Invalid FIL address: {validationError}
        </p>
    </form>
  )
}
