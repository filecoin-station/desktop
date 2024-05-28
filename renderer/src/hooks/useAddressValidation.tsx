import { ChangeEventHandler, useRef, useState } from 'react'
import { validateAddress } from 'src/lib/utils'

const useAddressValidation = ({ initialValid }: {initialValid: boolean}) => {
  const [inputState, setInputState] = useState({
    isValid: initialValid,
    error: ''
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const validateOnChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { value } = event.target

    if (value === '') {
      setInputState({
        isValid: false,
        error: ''
      })
    } else {
      const isValid = await validateAddress(value)
      setInputState({
        isValid,
        error: isValid ? '' : 'The FIL address entered is invalid. Please try again.'
      })
    }
  }

  return {
    inputRef,
    validateOnChange,
    inputState
  }
}

export default useAddressValidation
