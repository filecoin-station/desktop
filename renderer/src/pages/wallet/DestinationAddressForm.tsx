import BorderedBox from 'src/components/BorderedBox'
import Button from 'src/components/Button'
import Text from 'src/components/Text'
import TextInput from 'src/components/TextInput'
import useWallet from 'src/hooks/StationWallet'
import useAddressValidation from 'src/hooks/useAddressValidation'

const DestinationAddressForm = ({
  editDestinationAddress
}: {
  editDestinationAddress: ReturnType<typeof useWallet>['editDestinationAddress'];
}) => {
  const { inputRef, validateOnChange, inputState } = useAddressValidation({ initialValid: false })

  function handleSubmit () {
    editDestinationAddress(inputRef.current?.value)
  }

  return (
    <BorderedBox className='relative flex flex-col gap-5 bg-white p-5 w-[80%] mx-auto mt-[460px]'>
      <Text as='p' bold size='s'>Enter a destination to transfer your FIL</Text>
      <TextInput
        ref={inputRef}
        variant='primary'
        placeholder='Destination address'
        name='destinationAddress'
        onChange={validateOnChange}
        error={inputState.error}
      />
      <Button
        variant='primary'
        className='w-fit mx-auto'
        disabled={!inputState.isValid}
        onClick={handleSubmit}
      >
          Save
      </Button>
    </BorderedBox>
  )
}

export default DestinationAddressForm
