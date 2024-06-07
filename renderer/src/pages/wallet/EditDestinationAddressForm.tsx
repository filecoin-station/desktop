import { useEffect, useState } from 'react'
import Text from 'src/components/Text'
import TextInput from 'src/components/TextInput'
import useWallet from 'src/hooks/StationWallet'
import EditIcon from 'src/assets/img/icons/edit.svg?react'
import Button from 'src/components/Button'
import useAddressValidation from 'src/hooks/useAddressValidation'
import Tooltip from 'src/components/Tooltip'
import Transition from 'src/components/Transition'

const EditDestinationAddressForm = ({
  destinationAddress,
  editDestinationAddress
}: {
  destinationAddress: ReturnType<typeof useWallet>['destinationFilAddress'];
  editDestinationAddress: ReturnType<typeof useWallet>['editDestinationAddress'];
}) => {
  const [editing, setEditing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { inputRef, validateOnChange, inputState } = useAddressValidation({ initialValid: true })

  const handleSave = () => {
    editDestinationAddress(inputRef.current?.value)
    setEditing(false)
    setShowTooltip(true)

    const timeout = setTimeout(() => {
      setShowTooltip(false)
    }, 700)

    return () => clearTimeout(timeout)
  }

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    } else {
      inputRef.current?.setSelectionRange(0, 0)
      inputRef.current?.blur()
    }
  }, [editing, inputRef])

  return (
    <div className='absolute left-0 right-0 mx-auto top-[30%] scale-95 -translate-y-[50%]'>
      <div className="flex flex-col w-[80%] max-w-[480px] mx-auto z-10">
        <Transition on className='absolute -top-[32px]'>
          <Text uppercase font="mono" size="3xs" className='text-slate-50'>Destination address</Text>
        </Transition>

        <div className='relative'>
          <Tooltip
            bg='light'
            open={showTooltip}
            trigger={<div className='absolute h-0 bottom-0 w-full'></div>}
            content="Saved"
            side='bottom'
          />
          <TextInput
            ref={inputRef}
            variant='secondary'
            defaultValue={destinationAddress}
            onChange={validateOnChange}
            error={inputState.error}
            disabled={!editing}
          />
          <Transition on className='absolute right-0 -bottom-12'>
            {editing
              ? (
                <Button
                  variant='primary'
                  type='button'
                  className='ml-auto py-[4px]'
                  onClick={handleSave}
                  disabled={!inputState.isValid}
                >
                  Save
                </Button>
              )
              : (
                <button
                  type='button'
                  className='py-1 px-2 flex items-center gap-2 text-white focus-visible:outline-slate-400'
                  onClick={() => setEditing(true)}
                >
                  <EditIcon />
                  <Text size="xs" bold color='white'>Edit</Text>
                </button>
              )}
          </Transition>
        </div>

      </div>
    </div>
  )
}

export default EditDestinationAddressForm
