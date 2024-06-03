import Text from 'src/components/Text'
import { Wallet } from 'src/hooks/StationWallet'
import DestinationAddressForm from './DestinationAddressForm'
import BalanceControl from './BalanceControl'
import EditDestinationAddressForm from './EditDestinationAddressForm'
import { CSSProperties, useState } from 'react'
import Transition from 'src/components/Transition'

const SEND_THRESHOLD = 0.01

const TransferWrapper = ({
  destinationFilAddress,
  stationAddress,
  processingTransaction,
  walletBalance,
  editDestinationAddress,
  transferAllFundsToDestinationWallet,
  dismissCurrentTransaction
}: {
  walletBalance: Wallet['walletBalance'];
  destinationFilAddress?: Wallet['destinationFilAddress'];
  stationAddress?: Wallet['stationAddress'];
  processingTransaction : Wallet['processingTransaction'];
  editDestinationAddress:Wallet['editDestinationAddress'];
  transferAllFundsToDestinationWallet: Wallet['transferAllFundsToDestinationWallet'];
  dismissCurrentTransaction: Wallet['dismissCurrentTransaction'];
}) => {
  const [isShowingEditAddress, setIsShowingAddressEdit] = useState(false)

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
            onUnmount={() => setIsShowingAddressEdit(true)}
            outClass='animate-addressFormMoveUp'
            className='absolute w-[80%] mx-auto left-0 right-0 top-[70%] -translate-y-[50%]'
          >
            <DestinationAddressForm
              editDestinationAddress={editDestinationAddress}
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
            className='absolute top-[65%] left-0 right-0 mx-auto -translate-y-[50%]'
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
