import Text from 'src/components/Text'
import { Wallet } from 'src/hooks/StationWallet'
import DestinationAddressForm from './DestinationAddressForm'
import BalanceControl from './BalanceControl'
import EditDestinationAddressForm from './EditDestinationAddressForm'
import { useState } from 'react'
import ConfirmTransfer from './ConfirmTransfer'

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
  const [isShowingConfirm, setIsShowingConfirm] = useState(false)

  return (
    <section className='w-1/2 bg-black relative flex flex-col'>
      {stationAddress && (
        <>
          {!destinationFilAddress && (
            <DestinationAddressForm editDestinationAddress={editDestinationAddress} />
          )}

          {destinationFilAddress && (
            <EditDestinationAddressForm
              destinationAddress={destinationFilAddress}
              editDestinationAddress={editDestinationAddress}
            />
          )}

          {destinationFilAddress && !isShowingConfirm && (
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
          )}
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
