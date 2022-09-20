import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getStationUserOnboardingCompleted, setStationUserOnboardingCompleted } from '../components/InterfaceCalls'
import Onboarding from '../components/Onboarding'
import { ReactComponent as StationLogoLight } from '../assets/img/station-logo-light.svg'

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <StationLogoLight width="720px" />
    </div>
  )
}

const Welcome = (): JSX.Element => {
  const [status, setStatus] = useState<string>('loading')

  useEffect(() => {
    getStationUserOnboardingCompleted().then((res) => {
      setTimeout(() => { setStatus(res ? 'finished' : 'onboarding') }, 2000)
    })
  })

  const finishOnboarding = () => {
    setStationUserOnboardingCompleted().then(() => setStatus('finished'))
  }

  return (
    <div className="fixed bg-grayscale-200 w-full h-full top-0 left-0">
      { status === 'loading' && <div className="h-full w-full"><Loading /></div>}
      { status === 'onboarding' && <div className="flex justify-center items-center h-full">
        <Onboarding onFinish={finishOnboarding} />
      </div>}
      { status === 'finished' && <Navigate to="/dashboard" replace />}
    </div>
  )
}

export default Welcome
