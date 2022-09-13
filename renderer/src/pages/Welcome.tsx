import { useState, useEffect } from 'react'
import FilAddressForm from '../components/FilAddressForm'
import Modal from '../components/Modal.js'
import Onboarding from '../components/Onboarding'
import StationLogoLight from './../assets/img/station-logo-light.svg'
import StationLogoDark from './../assets/img/station-logo-dark.svg'
import { Navigate } from 'react-router-dom'
import { setStationFilAddress, getStationFilAddress, getStationUserSawOnboarding, setStationUserSawOnboarding, getStationUserConsent, setStationUserConsent } from './../components/InterfaceCalls'
import Consent from '../components/Consent'
import video from './../assets/video/abstract.mp4'

const Loading = () => {
  return (
    <div className="bg-gray-200 z-40 absolute top-0 right-0 left-0 bottom-0 backdrop-blur-sm bg-grayscale-500">
      <div className="flex justify-center items-center w-full h-full">
        <img src={StationLogoLight} width={320}/>
      </div>
    </div>

  )
}

const CreateWalletInfo = () => {
  return (
    <div className="">
      <h2 className="subtitle text-white text-body-l">Don't have filecoin address?
        Check Station website and create <span className=''>new one</span>.</h2>
    </div>
  )
}

const Welcome = (): JSX.Element => {
  const [filAddress, setFilAddress] = useState<string | undefined>(undefined)
  const [userOnboarded, setUserOnboarded] = useState<boolean | undefined>()
  const [userConsent, setUserConsent] = useState<boolean | undefined>()
  const [isOpen, setIsOpen] = useState(!!userOnboarded)

  const updateStatus = (): void => {
    getStationFilAddress().then(setFilAddress)
    getStationUserConsent().then((res) => {
      setTimeout(() => { setUserConsent(res) }, 5000)
    })
    getStationUserSawOnboarding().then((res) => {
      setTimeout(() => { setUserOnboarded(res); setIsOpen(!res) }, 5000)
    })
  }

  useEffect(() => {
    updateStatus()
  }, [filAddress])

  const setSysFilAddress = (address: string | undefined) => {
    setStationFilAddress(address).then(() => { setFilAddress(address) })
  }

  const manageConsent = (decision: boolean) => {
    setStationUserConsent(decision).then(() => { setUserConsent(decision) })
  }

  const finishOnboarding = () => {
    setStationUserSawOnboarding().then(() => { setUserOnboarded(true); setIsOpen(false) })
  }

  const openOnboarding = () => {
    setModalContent(<Onboarding onFinish={finishOnboarding} />)
    setIsOpen(true)
  }

  const openConsent = (accept: () => void) => {
    setModalContent(<Consent onAccept={accept} onReject={() => { setIsOpen(false) }} />)
    setIsOpen(true)
  }
  const [modalContent, setModalContent] = useState(<Onboarding onFinish={finishOnboarding} />)

  const afterSetFilAddress = (address: string | undefined) => {
    if (userConsent !== true) {
      openConsent(() => {
        manageConsent(true)
        setSysFilAddress(address)
      })
    } else {
      setSysFilAddress(address)
    }
  }

  if (filAddress && filAddress !== '' && userConsent) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      {(typeof (userOnboarded) === 'undefined' || typeof (userConsent) === 'undefined') ? <Loading /> : ''}
      <div className="grid grid-cols-5 h-full bg-grayscale-200">
        <video className='absolute z-0 w-auto min-w-full min-h-full ml-[30%] object-cover' autoPlay loop muted>
          <source src={video} type='video/mp4' />
        </video>
        {/* <div className='fixed top-0 right-0 z-1 w-full h-full bg-gradient-to-tr from-grayscale-200 via-grayscale-200 to-[#f7f7f7e3]'/>
        <div className='fixed top-0 right-0 z-1 w-full h-full bg-gradient-to-r from-grayscale-200 via-grayscale-200 to-[#f7f7f7e3]'/> */}
        <div className='fixed top-0 right-0 z-1 w-full h-full gradient-bg' />

        <div className="col-span-3 h-full z-10">
          <div className='flex flex-col h-full mx-20'>
            <div className="basis-1/4">
              
            </div>

            <div className="basis-2/4 flex place-items-center">
              <FilAddressForm showOnboarding={openOnboarding} sysFilAddress={filAddress} setFilAddress={afterSetFilAddress} />
            </div>

          </div>
        </div>

        <div className="col-span-2 h-screen z-10 flex justify-center items-center mx-20">
            {/* <CreateWalletInfo /> */}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={undefined}>
        {modalContent}
      </Modal>

    </>
  )
}

export default Welcome
