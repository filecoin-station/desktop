import { useCallback } from 'react'
import FilAddressForm from '../components/FilAddressForm'
import BackgroundGraph from './../assets/img/graph.svg'
import { useNavigate } from 'react-router-dom'
import { startSaturnNode, setDestinationWalletAddress as saveFilAddress } from '../lib/station-config'
import UpdateBanner from '../components/UpdateBanner'

const WalletConfig = (): JSX.Element => {
  const navigate = useNavigate()

  const setStationFilAddress = useCallback(async (address: string | undefined) => {
    await saveFilAddress(address)
    startSaturnNode()
    navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <div className="w-full h-full overflow-y-hidden relative">
      <UpdateBanner />
      <img src={BackgroundGraph} className="absolute -z-2 w-full h-full object-cover" alt="station background" />
      <div className='absolute -z-1 w-full h-full gradient-bg' />

      <div className="relative min-w-[840px] max-w-[1440px] h-full mx-auto my-0">
        <div className='md:ml-12 xl:w-full max-w-[980px] h-full flex flex-col justify-center'>
          <h2 className="title text-black mb-24 font-bold text-header-xl">
            Connect a FIL address to Station to start <span className='text-primary'> earning FIL</span>
          </h2>
          <FilAddressForm setFilAddress={setStationFilAddress} />
        </div>
      </div>

    </div>
  )
}

export default WalletConfig
