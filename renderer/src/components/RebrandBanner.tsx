import Text from './Text'
import { useState } from 'react'
import CloseIcon from 'src/assets/img/icons/close.svg?react'
import { openExternalURL } from 'src/lib/station-config'
import { useLocation } from 'react-router'
import { ROUTES } from 'src/lib/routes'

const RebrandBanner = () => {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState<boolean>(true)

  if (!visible) {
    return null
  }

  if (pathname === ROUTES.wallet) {
    return null
  }

  return (
    <div className='absolute top-0 left-0 pl-28 pt-6 flex'>
      <div className='bg-primary ml-1 p-6 pr-12 left-40 flex gap-5 rounded-lg'>
        <Text font='mono' size='xs' bold className="text-white">🚨 Filecoin Station is becoming the Checker Network. <button onClick={() => openExternalURL('https://blog.checker.network/posts/why-web3-needs-the-checker-network')}><Text font='mono' size='xs' bold className="text-white underline" >Read more</Text></button></Text>
        <button
          className="absolute top-8 right-2"
          onClick={() => setVisible(false)}
        >
          <CloseIcon />
        </button>
      </div>

    </div>
  )
}

export default RebrandBanner
