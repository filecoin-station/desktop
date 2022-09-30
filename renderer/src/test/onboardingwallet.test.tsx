import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'

import '../lib/station-config'
import Onboarding from '../pages/Onboarding'
import { BrowserRouter } from 'react-router-dom'

/**
 * This test was intentionally isolated from others on onboarding.test.tsx
 * Mocking the same object multiples times (../lib/station-config and 'react-router-dom') with
 * different responses is leading to overwrites which makes tests failing.
 * This is something that deserves a deeper exploration in order to clarify wich is the best structure
 * to use on vitest. In the meantime, this will ensure the feature integrity running on this separate file
 */

const mockedUsedNavigateDashboard = vi.fn()

describe('User has completed the onboarding and set up wallet previously', () => {
  beforeAll(() => {
    vi.clearAllMocks()
    vi.mock('../lib/station-config', () => {
      return {
        getFilAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
        setOnboardingCompleted: () => Promise.resolve(undefined),
        getOnboardingCompleted: (status: boolean) => Promise.resolve(false)
      }
    })

    vi.mock('react-router-dom', async () => {
      const router: typeof import('react-router-dom') = await vi.importActual('react-router-dom')
      return {
        ...router,
        useNavigate: () => mockedUsedNavigateDashboard
      }
    })
  })

  beforeEach(() => {
    vi.resetAllMocks()
    render(<BrowserRouter> <Onboarding /></BrowserRouter >)
  })

  test('redirects to dashboard directly if user is onboarded', async () => {
    await waitFor(() => expect(mockedUsedNavigateDashboard).toHaveBeenCalledTimes(1), { timeout: 3000 })
    await waitFor(() => expect(mockedUsedNavigateDashboard).toHaveBeenCalledWith('/dashboard', { replace: true }), { timeout: 3000 })
  })
})
