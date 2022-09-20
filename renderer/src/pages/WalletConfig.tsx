import { useState, useEffect } from 'react'
import FilAddressForm from '../components/FilAddressForm'
import BackgroundGraph from './../assets/img/graph.svg'
import { Navigate } from 'react-router-dom'
import { setStationFilAddress, getStationFilAddress } from './../components/InterfaceCalls'

const WalletConfig = (): JSX.Element => {
  const [filAddress, setFilAddress] = useState<string | undefined>(undefined)
  
  const updateStatus = (): void => {
    getStationFilAddress().then(setFilAddress)
  }

  useEffect(() => {
    updateStatus()
  }, [filAddress])

  const setSysFilAddress = (address: string | undefined) => {
    setStationFilAddress(address).then(() => { setFilAddress(address) })
  }


  const afterSetFilAddress = (address: string | undefined) => {
    setSysFilAddress(address)
  }
  
  if (filAddress && filAddress !== '') {
    console.log(filAddress)
    return <Navigate to="/" replace />
  }

  return (
    <>
      <div className="w-full h-full relative">
        <img src={BackgroundGraph} className="absolute -z-2 w-full h-full object-cover" />
        <div className='absolute -z-1 w-full h-full gradient-bg' />
        <div className="relative max-w-[1440px] h-full mx-auto my-0">          
          <div className='w-[100%] max-w-[980px] h-full flex flex-col justify-center'>
            <FilAddressForm showOnboarding={() => {}} sysFilAddress={filAddress} setFilAddress={afterSetFilAddress} />
          </div>
        </div>
      </div>
    </>
  )
}

export default WalletConfig
