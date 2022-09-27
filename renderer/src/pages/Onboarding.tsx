import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFilAddress, getOnboardingCompleted, setOnboardingCompleted } from '../lib/station-config'
import Onboarding from '../components/Onboarding'
import { ReactComponent as StationLogoLight } from '../assets/img/station-logo-light.svg'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const Loading = () => {
  return (
    <div className="fixed bg-grayscale-200 w-full h-full top-0 left-0 loading">
      <div className="flex justify-center items-center h-full w-full">
        <StationLogoLight width="720px" />
      </div>
    </div>
  )
}

const OnboardingPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean|null>()
  const [filAddress, setFilAddress] = useState<string|null>()

  useEffect(() => {
    (async () => {
      await sleep(2000)
      setFilAddress(await getFilAddress())
      setIsOnboardingCompleted(await getOnboardingCompleted())
      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (isOnboardingCompleted && !filAddress) {
      navigate('/wallet', { replace: true })
    } else if (filAddress) {
      navigate('/dashboard', { replace: true })
    }
  }, [isOnboardingCompleted, filAddress, navigate])

  const onFinishOnboarding = useCallback(async () => {
    setIsOnboardingCompleted(true)
    await setOnboardingCompleted()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="fixed bg-grayscale-200 w-full h-full top-0 left-0">
      <div className="flex justify-center items-center h-full">
        <Onboarding onFinish={onFinishOnboarding} />
      </div>
    </div>
  )
}

export default OnboardingPage
