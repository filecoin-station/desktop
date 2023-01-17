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
              <p className='text-body-2xs mt-1'>Your Station Wallet has a unique address, where all the FIL you earn will be stored.
                Station will send your FIL earnings to this wallet on a daily basis. </p>
            </div>
          </div>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <TransferIcon />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>TRANSFERRING YOUR FIL</p>
              <p className='text-body-2xs mt-1'>In order to transfer FIL out of your Station Wallet,
                you need to set a FIL address to send out your FIL. We recommend you transfer your FIL at least every 30 days.</p>
            </div>
          </div>
          <div className='flex flex-row align-middle h-[90px] w-full bg-grayscale-100 rounded'>
            <div className='w-[80px] min-w-[80px] bg-primary h-full rounded-l grid place-items-center'>
              <CafeIcon />
            </div>
            <div className='py-3 px-6 pr-24'>
              <p className='text-body-s text-primary font-body uppercase'>GAS FEES</p>
              <p className='text-body-2xs mt-1'>All transfers of assets in the blockchain incur on gas fees,
                which vary depending on the network's activity and are deducted from the total amount you're transferring.</p>
            </div>
          </div>
        </div>
  )
}

export default WalletOnboarding
