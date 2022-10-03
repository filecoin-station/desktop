import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'

import '../lib/station-config'
import Welcome from '../pages/Welcome'
import { BrowserRouter } from 'react-router-dom'

/**
 * This test was intentionally isolated from others on welcome_X.test.tsx
 * Mocking the same object multiples times (../lib/station-config and 'react-router-dom') with
 * different responses is leading to overwrites which makes tests failing.
 * This is something that deserves a deeper exploration in order to clarify wich is the best structure
 * to use on vitest. In the meantime, this will ensure the feature integrity running on this separate file
 */

const mockedUsedNavigate = vi.fn()
describe('Welcome page', () => {
  describe('User has completed the onboarding and set up wallet previously', () => {
    beforeAll(() => {
      vi.clearAllMocks()
      vi.mock('../lib/station-config', () => {
        return {
          getFilAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
          getOnboardingCompleted: (status: boolean) => Promise.resolve(true)
        }
      })

      vi.mock('react-router-dom', async () => {
        const router: typeof import('react-router-dom') = await vi.importActual('react-router-dom')
        return {
          ...router,
          useNavigate: () => mockedUsedNavigate
        }
      })
    })

    beforeEach(() => {
      vi.resetAllMocks()
      render(<BrowserRouter> <Welcome /></BrowserRouter >)
    })

    test('redirects to dashboard directly if user is onboarded', async () => {
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(1), { timeout: 3000 })
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true }), { timeout: 3000 })
    })
  })
})
