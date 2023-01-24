import { ReactComponent as CafeIcon } from '../assets/img/icons/cafe.svg'
import { ReactComponent as TransferIcon } from '../assets/img/icons/transfer.svg'
import { ReactComponent as WalletIcon } from '../assets/img/icons/wallet.svg'

const WalletOnboarding = () => {
  return (
    <div className='flex flex-col gap-3 px-6 pt-12'>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <WalletIcon width={32} height={32} fill="white" />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>YOUR STATION WALLET</p>
              <p className='text-body-2xs mt-1'>Your Station Wallet has a unique address, where all the FIL you earn will be stored. Station will send FIL to this wallet on a regular basis, based on your contributions.</p>
            </div>
          </div>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <TransferIcon />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>TRANSFERRING YOUR FIL</p>
              <p className='text-body-2xs mt-1'>In order to transfer FIL out of your Station Wallet, you need to set a destination FIL address to which to send your FIL. We recommend you regularly transfer the FIL in your Station Wallet to a more secure wallet.</p>
            </div>
          </div>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <CafeIcon />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>GAS FEES</p>
              <p className='text-body-2xs mt-1'>All transactions on the blockchain incur a small gas fee, which can vary depending on network activity. This is deducted from the total amount you are transferring.</p>
            </div>
          </div>
        </div>
  )
}

export default WalletOnboarding
