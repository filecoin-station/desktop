import { ReactNode } from 'react'
import Sidebar from './Sidebar'

const BaseLayout = ({ children }: {children: ReactNode}) => {
  return (
    <div className='flex'>
      <Sidebar />
      <main>
        {children}
      </main>
    </div>
  )
}

export default BaseLayout
