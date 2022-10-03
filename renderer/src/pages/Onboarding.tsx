import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOnboardingCompleted } from '../lib/station-config'
import Onboarding from '../components/Onboarding'

const OnboardingPage = (): JSX.Element => {
  const navigate = useNavigate()

  const onFinishOnboarding = useCallback(async () => {
    await setOnboardingCompleted()
    navigate('/wallet', { replace: true })
  }, [navigate])

  return (
    <div className="fixed bg-grayscale-200 w-full h-full top-0 left-0">
      <div className="flex justify-center items-center h-full">
        <Onboarding onFinish={onFinishOnboarding} />
      </div>
    </div>
  )
}

export default OnboardingPage
