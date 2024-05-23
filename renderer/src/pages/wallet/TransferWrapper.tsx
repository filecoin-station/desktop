import { useRef } from 'react'
import BorderedBox from 'src/components/BorderedBox'
import Button from 'src/components/Button'
import Text from 'src/components/Text'
import TextInput from 'src/components/TextInput'
import GridCanvas from './GridCanvas'

const TransferWrapper = () => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className='w-1/2 bg-black relative flex flex-col'>
        <GridCanvas container={ref} />

        <BorderedBox className='relative flex flex-col gap-5 bg-white p-5 w-[80%] mx-auto mt-auto mb-12'>
            <Text as='p' bold size='s'>Enter a destination to transfer your FIL</Text>
            <TextInput placeholder='Destination address' name='destinationAddress' />
            <Button variant='primary' className='w-fit mx-auto'>Save</Button>
        </BorderedBox>
        <footer className='relative text-center mb-9'>
            <Text size='xs' color='white' bold>
                Learn more about your Station wallet
            </Text>
        </footer>
    </section>
  )
}

export default TransferWrapper
