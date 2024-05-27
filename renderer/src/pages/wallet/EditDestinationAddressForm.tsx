import { useEffect, useState } from 'react'
import Text from 'src/components/Text'
import TextInput from 'src/components/TextInput'
import useWallet from 'src/hooks/StationWallet'
import EditIcon from 'src/assets/img/icons/edit.svg?react'
import Button from 'src/components/Button'
import useAddressValidation from 'src/hooks/useAddressValidation'
import Tooltip from 'src/components/Tooltip'

const EditDestinationAddressForm = ({
  destinationAddress,
  editDestinationAddress
}: {
    destinationAddress: ReturnType<typeof useWallet>['destinationFilAddress'];
    editDestinationAddress: ReturnType<typeof useWallet>['editDestinationAddress'];
}) => {
  const [editing, setEditing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { inputRef, validateOnChange, inputState } = useAddressValidation()

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
    }
  }, [editing, inputRef])

  return (
    <div className="flex flex-col gap-3 w-[80%] mx-auto mt-[200px] z-10">
      <Text uppercase font="mono" size="3xs" className='text-slate-50'>Destination address</Text>

      <div className='relative'>
        <Tooltip
          bg='light'
          open={showTooltip}
          trigger={<div className='absolute h-[1px] bottom-0 w-full'></div>}
          content="Saved"
          side='bottom'
        />
        {editing
          ? (
            <TextInput
              ref={inputRef}
              variant='secondary'
              defaultValue={destinationAddress}
              onChange={validateOnChange}
              error={inputState.error}
            />
          )
          : (
            <div className='border border-dashed border-slate-400 p-[10px] rounded-[4px] text-center bg-black'>
              <Text size="xs" className='text-slate-100 leading-6'>{destinationAddress}</Text>
            </div>
          )}
      </div>

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
          <Button
            variant='tertiary'
            type='button'
            className='ml-auto py-[4px]'
            onClick={() => setEditing(true)}
            icon={<EditIcon />}
          >
            Edit
          </Button>
        )}
    </div>
  )
}

export default EditDestinationAddressForm
