import Text from 'src/components/Text'
import GridCanvas from './GridCanvas'
import useWallet from 'src/hooks/StationWallet'
import DestinationAddressForm from './DestinationAddressForm'
import BalanceControl from './BalanceControl'
import EditDestinationAddressForm from './EditDestinationAddressForm'

const SEND_THRESHOLD = 0.01

const TransferWrapper = ({
  destinationFilAddress,
  editDestinationAddress,
  transferAllFundsToDestinationWallet,
  stationAddress
}: {
  destinationFilAddress?: string;
  stationAddress?: string;
  editDestinationAddress: (address: string | undefined) => void;
  transferAllFundsToDestinationWallet: () => Promise<void>;
}) => {
  const { walletBalance } = useWallet()

  return (
    <section className='w-1/2 bg-black relative flex flex-col'>
      <GridCanvas />

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

          {destinationFilAddress && (
            <BalanceControl
              balance={walletBalance}
              sendThreshold={SEND_THRESHOLD}
              transfer={transferAllFundsToDestinationWallet}
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
