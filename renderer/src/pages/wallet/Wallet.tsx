import useWallet from 'src/hooks/StationWallet'
import { formatFilValue, openExplorerLink, truncateString } from 'src/lib/utils'
import TransactionHistory from './TransactionHistory'
import TransferForm from './TransferForm'

const Wallet = () => {
  const {
    walletBalance,
    stationAddress,
    stationAddress0x,
    walletTransactions,
    processingTransaction
  } = useWallet()

  return (
    <div>
        <h1 className='font-bold mb-4'>Wallet</h1>
        <div className="flex gap-8">
            <section className="w-1/3">
                <div className='mb-4'>
                    <h2>Station wallet balance</h2>
                    {formatFilValue(walletBalance)}{' '}FIL
                </div>
                <div className='flex justify-between'>
                    <p>Station address</p>
                    <button type='button' onClick={() => openExplorerLink(stationAddress)}>Explorer</button>
                </div>
                <div className='flex justify-between'>
                    <span>{truncateString(stationAddress)}</span>
                    <span>{truncateString(stationAddress0x)}</span>
                </div>

                <div className='my-4'>
                    <TransactionHistory
                        walletTransactions={walletTransactions}
                        processingTransaction={processingTransaction}
                    />
                </div>
            </section>

            <section className="w-1/3">
                <TransferForm />
            </section>

        </div>
    </div>
  )
}

export default Wallet
