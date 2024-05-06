import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { useDialog } from 'src/components/DialogProvider'
import useWallet from 'src/hooks/StationWallet'
import { validateAddress, addressIsF1 } from 'src/lib/utils'
import ConfirmationDialog from './ConfirmationDialog'

const TransferForm = () => {
  const { destinationFilAddress, editDestinationAddress, transferAllFundsToDestinationWallet } = useWallet()
  const { openDialog } = useDialog()
  const { walletBalance } = useWallet()

  const [addressIsValid, setAddressIsValid] = useState(true)
  const [address, setAddress] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (destinationFilAddress) {
      setAddress(destinationFilAddress)
    }
  }, [destinationFilAddress])

  async function handleInputChange (event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value === '') {
      setAddressIsValid(true)
    }

    setAddressIsValid(await validateAddress(event.target.value))
    setAddress(event.target.value)
  }

  function handleEditClick () {
    inputRef.current?.focus()
  }

  async function handleSaveAddress (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (addressIsValid) {
      editDestinationAddress(address)
    }
  }

  function handleTransfer (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    openDialog({
      content: (
        <ConfirmationDialog
          amount={walletBalance || ''}
          destination={destinationFilAddress || ''}
          onProceed={transferAllFundsToDestinationWallet}
        />
      )
    })
  }

  const hasAddressSaved = destinationFilAddress && address === destinationFilAddress

  return (
    <div>
        <p className='font-bold'>Transfer Destination address</p>

        <form onSubmit={hasAddressSaved ? handleTransfer : handleSaveAddress}>
            <div className='my-4'>
                <input
                    name='address'
                    type="text"
                    placeholder="Destination"
                    defaultValue={address}
                    onChange={handleInputChange}
                    ref={inputRef}
                />
            </div>

            {hasAddressSaved && (
                <button type='button' onClick={handleEditClick} className='block my-2'>Edit</button>
            )}

            {addressIsValid && addressIsF1(address) && (
              <p>The FIL address entered is invalid. Please check and try again.</p>
            )}

            {!addressIsValid && (
              <p>The FIL address entered is invalid. Please check and try again.</p>
            )}

            <button type='submit' className='block' disabled={!addressIsValid}>
                {hasAddressSaved ? 'Transfer' : 'Save'}
            </button>
        </form>

    </div>
  )
}

export default TransferForm
