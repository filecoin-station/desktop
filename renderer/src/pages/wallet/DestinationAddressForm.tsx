import Button from 'src/components/Button'
import Text from 'src/components/Text'
import TextInput from 'src/components/TextInput'
import Transition from 'src/components/Transition'
import useWallet from 'src/hooks/StationWallet'
import useAddressValidation from 'src/hooks/useAddressValidation'

const DestinationAddressForm = ({
  editDestinationAddress,
  destinationFilAddress
}: {
  editDestinationAddress: ReturnType<typeof useWallet>['editDestinationAddress'];
  destinationFilAddress: ReturnType<typeof useWallet>['destinationFilAddress'];
}) => {
  const { inputRef, validateOnChange, inputState } = useAddressValidation({ initialValid: false })

  function handleSubmit () {
    editDestinationAddress(inputRef.current?.value)
  }

  const hasAddressSaved = !!destinationFilAddress

  return (
    <Transition
      on={!hasAddressSaved}
      outClass='bg-black scale-95 p-[1px] border-0'
      inClass='bg-white max-h-[208px] border-slate-400 p-5'
      className={`flex flex-col overflow-hidden
      border border-dashed rounded-lg destination-address-form`}
    >
      <Transition
        on={!hasAddressSaved}
        inClass='h-[20px] mb-5'
        outClass='h-[0]'
        className='overflow-hidden destination-address-form-info'
      >
        <Text as='p' bold size='s'>Enter a destination to transfer your FIL</Text>
      </Transition>

      <TextInput
        ref={inputRef}
        variant={hasAddressSaved ? 'secondary' : 'primary'}
        placeholder='Destination address'
        name='destinationAddress'
        className='destination-address-form-input text-center'
        onChange={validateOnChange}
        error={inputState.error}
      />

      <Transition
        on={!hasAddressSaved}
        inClass='h-[40px] mt-5'
        outClass='h-[0]'
        className='overflow-hidden destination-address-form-info'
      >
        <Button
          variant='primary'
          className='w-fit mx-auto mt-auto'
          disabled={!inputState.isValid}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Transition>
    </Transition>
  )
}

export default DestinationAddressForm
