import { useState, useEffect } from 'react'
import FilAddressForm from '../components/FilAddressForm'
import Modal from '../components/Modal.js'
import Onboarding from '../components/Onboarding'
import StationLogoLight from './../assets/img/station-logo-light.svg'
import { Navigate } from 'react-router-dom'
import { setStationFilAddress, getStationFilAddress } from './../components/InterfaceCalls'
import Consent from '../components/Consent'

const Loading = () => {
  return (
    <div className="bg-gray-200 z-40 absolute top-0 right-0 left-0 bottom-0 backdrop-blur-sm">
      <div className="flex justify-center items-center w-full h-full">
        <h1>Loading...</h1>
      </div>
    </div>

  )
}

const CreateWalletInfo = () => {
  return (
    <div className='grid h-screen place-items-center mx-20'>
      <div className="w-full">
        <div className='w-full max-w-2xl'>
          <div className="px-6 py-4">
            <h1 className="font-bold text-3xl mb-10">Don't have filecoin address?
              Check Station website and create one new.</h1>
            <div className="flex gap-6">
              {/* <a href="https://filwallet.co/" target="_blank" rel="noreferrer" >
                <img src={PlayStoreBadge} width="134" alt="Play Store badge" />
              </a>
              <a href="https://filwallet.co/" target="_blank" rel="noreferrer" >
                <img src={AppStoreBadge} width="120" alt="App Store badge" />
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Welcome = () : JSX.Element => {
  const [filAddress, setFilAddress] = useState<string | undefined>()
  const [loadingState, setLoadingState] = useState<boolean>(true)
  const [userOnboarded, setUserOnboarded] = useState<boolean>(false)
  const [userConsent, setUserConsent] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(!userOnboarded)

  const updateStatus = (): void => {
    getStationFilAddress().then((sysFilAddress): void => {
      // test purposes: animation
      setTimeout(() => { setLoadingState(false) }, 3000)
      setFilAddress(sysFilAddress)
    })
  }

  useEffect(() => {
    updateStatus()
    // fixme: Is this needed? what for?
    // const id = setInterval(updateStatus, 1000)
    // return () => clearInterval(id)
  }, [filAddress])

  const setSysFilAddress = (address: string | undefined) => {
    setStationFilAddress(address).then(() => { setFilAddress(address) })
  }

  const manageConsent = (decision: boolean) => {
    // electron: setStationUserOnboarded
    setUserConsent(decision)
  }

  const finishOnboarding = () => {
    // electron: setStationUserOnboarded
    setIsOpen(false)
    setUserOnboarded(true)
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
    openConsent(() => { manageConsent(true); setSysFilAddress(address) })
  }

  if (filAddress && filAddress !== '' && userConsent) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      {loadingState === true && <Loading />}
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-2 h-full bg-neutral-100">
          <div className='flex flex-col h-full mx-20'>
            <div className="basis-1/4">
              <img className="left-0 pt-10" src={StationLogoLight} width="200px" alt="Station Logo" />
            </div>

            <div className="basis-2/4 flex place-items-center">
              <FilAddressForm showOnboarding={openOnboarding} sysFilAddress={filAddress} setFilAddress={afterSetFilAddress} />
            </div>

          </div>
        </div>

        <div className="col-span-1 h-full bg-stone-300">
          <CreateWalletInfo />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={undefined}>
        {modalContent}
      </Modal>

    </>
  )
}

export default Welcome
