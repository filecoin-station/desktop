import { ReactNode } from 'react'
import Sidebar from 'src/components/Sidebar'
import UpdateBanner from 'src/components/UpdateBanner'
import WalletWidget from 'src/components/WalletWidget'
import DraggableArea from 'src/components/DraggableArea'
import RebrandBanner from 'src/components/RebrandBanner'

const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <div className='h-screen w-screen overflow-x-hidden flex relative app-bg'>
      <DraggableArea />
      <Sidebar />
      <RebrandBanner />
      <WalletWidget />
      <div className='w-full flex flex-wrap justify-end absolute'>
        <UpdateBanner />
      </div>
      {children}
    </div>
  )
}

export default Layout
