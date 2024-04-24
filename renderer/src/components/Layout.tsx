import { ReactNode, useState } from 'react'
import Sidebar from 'src/components/Sidebar'
import UpdateBanner from 'src/components/UpdateBanner'
import Modal from 'src/components/Modal'
import WalletWidget from 'src/components/WalletWidget'

const Layout = ({ children }: {children: ReactNode}) => {
  const [walletCurtainIsOpen, setWalletCurtainIsOpen] = useState(false)

  const toggleCurtain = () => setWalletCurtainIsOpen(!walletCurtainIsOpen)

  return (
    <div className='h-screen w-screen overflow-hidden bg-grayscale-100'>
      <div className='w-full flex flex-wrap justify-end'>
        <UpdateBanner />
        <Modal isOpen={walletCurtainIsOpen} setIsOpen={toggleCurtain} />
        <WalletWidget onClick={toggleCurtain} />
      </div>
      <div className='flex w-full'>
      <Sidebar />
      <main className='flex-1'>
        {children}
      </main>
      </div>
    </div>
  )
}

export default Layout
