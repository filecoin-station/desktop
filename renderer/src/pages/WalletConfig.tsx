import { useCallback } from 'react'
import FilAddressForm from '../components/FilAddressForm'
import BackgroundGraph from './../assets/img/graph.svg'
import { useNavigate } from 'react-router-dom'
import { startSaturnNode, setFilAddress as saveFilAddress } from '../lib/station-config'

const WalletConfig = (): JSX.Element => {
  const navigate = useNavigate()

  const setStationFilAddress = useCallback(async (address: string | undefined) => {
    await saveFilAddress(address)
    startSaturnNode()
    navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <div className="w-full h-full relative">
      <img src={BackgroundGraph} className="absolute -z-2 w-full h-full object-cover" alt="station background" />
      <div className='absolute -z-1 w-full h-full gradient-bg' />

      <div className="relative max-w-[1440px] h-full mx-auto my-0">
        <div className='w-[100%] max-w-[980px] h-full flex flex-col justify-center'>
          <h2 className="title text-black mb-24 font-bold text-header-xl">
            Connect to the Station with your FIL address to start <span className='text-primary'> earning FIL</span>
          </h2>
          <FilAddressForm setFilAddress={setStationFilAddress} />
        </div>
      </div>

    </div>
  )
}

export default WalletConfig
