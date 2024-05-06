import { ReactNode } from 'react'
import Sidebar from 'src/components/Sidebar'
import UpdateBanner from 'src/components/UpdateBanner'
import WalletWidget from 'src/components/WalletWidget'

const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <div className='h-screen w-screen overflow-hidden bg-grayscale-100'>
      <div className='w-full flex flex-wrap justify-end'>
        <UpdateBanner />
        <WalletWidget />
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
