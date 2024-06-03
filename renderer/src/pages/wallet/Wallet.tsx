import useWallet from 'src/hooks/StationWallet'
import { formatFilValue, openExplorerLink } from 'src/lib/utils'
import TransactionHistory from './TransactionHistory'
import BorderedBox from 'src/components/BorderedBox'
import Text from 'src/components/Text'
import Address from 'src/components/Address'
import LinkOut from 'src/assets/img/icons/link-out.svg?react'
import TransferWrapper from './TransferWrapper'

const Wallet = () => {
  const {
    walletBalance,
    stationAddress,
    stationAddress0x,
    walletTransactions,
    destinationFilAddress,
    editDestinationAddress,
    transferAllFundsToDestinationWallet,
    processingTransaction,
    dismissCurrentTransaction
  } = useWallet()

  return (
    <div className='w-full flex'>
      <main className='px-9 mt-28 flex flex-col flex-1'>
        <section className='flex flex-col gap-5 h-full mb-9'>
          <BorderedBox className='p-5 flex flex-col gap-2'>
            <Text font='mono' size='3xs' color='primary' uppercase>
                        &#47;&#47; Station wallet balance ... :
            </Text>
            <Text font='mono' size='s'>{formatFilValue(walletBalance)}{' '}FIL</Text>
          </BorderedBox>
          <BorderedBox className='p-5 flex flex-col gap-2'>
            <Text font='mono' size='3xs' color='primary' uppercase>&#47;&#47; Station address ... :</Text>
            <div className='flex gap-5 items-center'>
              <Address address={stationAddress} />
              <Address address={stationAddress0x} />
              <button
                type='button'
                className='text-primary ml-auto focus:outline-slate-400 w-5 h-5'
                onClick={() => openExplorerLink(stationAddress)}
              >
                <LinkOut />
              </button>
            </div>
          </BorderedBox>
          <div className='flex-1 flex flex-col'>
            <BorderedBox className='p-5 flex flex-col gap-2' isGrouped>
              <Text font='mono' size='3xs' color='primary' uppercase>
                            &#47;&#47; Transaction history ... :
              </Text>
            </BorderedBox>
            <BorderedBox className='p-5 flex flex-col gap-2 flex-1' isGrouped>
              <TransactionHistory walletTransactions={walletTransactions || []}/>
            </BorderedBox>
          </div>
        </section>
      </main>
      <TransferWrapper
        walletBalance={walletBalance}
        destinationFilAddress={destinationFilAddress}
        editDestinationAddress={editDestinationAddress}
        transferAllFundsToDestinationWallet={transferAllFundsToDestinationWallet}
        stationAddress={stationAddress}
        processingTransaction={processingTransaction}
        dismissCurrentTransaction={dismissCurrentTransaction}
      />
    </div>
  )
}

export default Wallet
