import Text from 'src/components/Text'
import { Wallet } from 'src/hooks/StationWallet'
import DestinationAddressForm from './DestinationAddressForm'
import BalanceControl from './BalanceControl'
import EditDestinationAddressForm from './EditDestinationAddressForm'
import { useState } from 'react'
import ConfirmTransfer from './ConfirmTransfer'
import Transition from 'src/components/Transition'
import BorderedBox from 'src/components/BorderedBox'

const SEND_THRESHOLD = 0.01

const TransferWrapper = ({
  // destinationFilAddress,
  stationAddress,
  processingTransaction,
  // walletBalance,
  // editDestinationAddress,
  transferAllFundsToDestinationWallet,
  dismissCurrentTransaction
}: {
  // walletBalance: Wallet['walletBalance'];
  // destinationFilAddress?: Wallet['destinationFilAddress'];
  stationAddress?: Wallet['stationAddress'];
  processingTransaction : Wallet['processingTransaction'];
  // editDestinationAddress:Wallet['editDestinationAddress'];
  transferAllFundsToDestinationWallet: Wallet['transferAllFundsToDestinationWallet'];
  dismissCurrentTransaction: Wallet['dismissCurrentTransaction'];
}) => {
  const [isShowingConfirm, setIsShowingConfirm] = useState(false)

  const walletBalance = '0'
  const [destinationFilAddress, editDestinationAddress] = useState('')

  return (
    <section
      className='w-1/2 bg-black relative flex flex-col overflow-hidden'
      style={{ '--factor': 1 }}
    >
      {stationAddress && (
        <>
          {/* {!destinationFilAddress && (
            <DestinationAddressForm editDestinationAddress={editDestinationAddress} />
          )} */}

          <Transition
            on={!destinationFilAddress}
            outClass='animate-addressFormMoveUp'
            className='absolute w-[80%] mx-auto left-0 right-0 top-[70%] -translate-y-[50%]'
          >
            <DestinationAddressForm
              editDestinationAddress={editDestinationAddress}
              destinationFilAddress={destinationFilAddress}
              shouldRender={!destinationFilAddress}
            />
          </Transition>

          {/* {destinationFilAddress && (
            <EditDestinationAddressForm
              destinationAddress={destinationFilAddress}
              editDestinationAddress={editDestinationAddress}
            />
          )} */}

          {/* {destinationFilAddress && !isShowingConfirm && (
            <BalanceControl
              walletBalance={walletBalance}
              sendThreshold={SEND_THRESHOLD}
              processingTransaction={processingTransaction}
              transfer={() => setIsShowingConfirm(true)}
            />
          )}

          {isShowingConfirm && (
            <ConfirmTransfer
              walletBalance={walletBalance}
              transferAllFundsToDestinationWallet={transferAllFundsToDestinationWallet}
              hide={() => setIsShowingConfirm(false)}
            />
          )} */}
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
