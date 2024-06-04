import Text from 'src/components/Text'
import { Wallet } from 'src/hooks/StationWallet'
import DestinationAddressForm from './DestinationAddressForm'
import BalanceControl from './BalanceControl'
import EditDestinationAddressForm from './EditDestinationAddressForm'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import Transition from 'src/components/Transition'

const SEND_THRESHOLD = 0.01

const TransferWrapper = ({
  stationAddress
  // destinationFilAddress,
  // processingTransaction,
  // walletBalance,
  // editDestinationAddress,
  // transferAllFundsToDestinationWallet
}: {
  walletBalance: Wallet['walletBalance'];
  destinationFilAddress?: Wallet['destinationFilAddress'];
  stationAddress?: Wallet['stationAddress'];
  processingTransaction : Wallet['processingTransaction'];
  editDestinationAddress:Wallet['editDestinationAddress'];
  transferAllFundsToDestinationWallet: Wallet['transferAllFundsToDestinationWallet'];
}) => {
  const [destinationFilAddress, editDestinationAddress] = useState('')
  const [processingTransaction, setProcessingTransaction] = useState()
  const [walletBalance, setWalletBalance] = useState('0.5')

  function transferAllFundsToDestinationWallet () {
    setProcessingTransaction({ status: 'processing', outgoing: true })

    setTimeout(() => {
      setProcessingTransaction({ status: 'succeeded', outgoing: true })
    }, 4000)

    setTimeout(() => {
      setProcessingTransaction(undefined)
      setWalletBalance('0')
    }, 6000)
  }

  const [isShowingEditAddress, setIsShowingAddressEdit] = useState(false)
  const inTransition = useRef(false)

  useEffect(() => {
    if (destinationFilAddress && !inTransition.current) {
      setIsShowingAddressEdit(true)
    }
  }, [destinationFilAddress])

  return (
    <section
      className='w-1/2 bg-black relative flex flex-col overflow-hidden'
      style={{ '--factor': 1 } as CSSProperties}
    >

      {stationAddress && (
        <>
          <Transition
            on={!destinationFilAddress}
            unmountOnEnd
            onUnmount={() => {
              inTransition.current = false
              setIsShowingAddressEdit(true)
            }}
            outClass='animate-addressFormMoveUp'
            className='absolute w-[80%] max-w-[600px] mx-auto left-0 right-0 top-[70%] -translate-y-[50%]'
          >
            <DestinationAddressForm
              onSave={(value) => {
                inTransition.current = true
                editDestinationAddress(value)
              }}
              destinationFilAddress={destinationFilAddress}
            />
          </Transition>

          {isShowingEditAddress && (
            <EditDestinationAddressForm
              destinationAddress={destinationFilAddress}
              editDestinationAddress={editDestinationAddress}
            />
          )}

          <Transition
            on={isShowingEditAddress}
            unmountOnEnd
            className='absolute top-[70%] left-0 right-0 mx-auto -translate-y-[50%] balance-control-wrapper'
          >
            <BalanceControl
              walletBalance={walletBalance}
              sendThreshold={SEND_THRESHOLD}
              processingTransaction={processingTransaction}
              transferAllFundsToDestinationWallet={transferAllFundsToDestinationWallet}
            />
          </Transition>
        </>
      )}

      <footer className='relative text-center mb-9 mt-auto'>
        <Text size='xs' color='white' bold as="a" href="https://docs.filstation.app/your-station-wallet">
          Learn more about your Station wallet
        </Text>
      </footer>
    </section>
  )
}

export default TransferWrapper
