import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import '../lib/station-config'
import Onboarding from '../pages/Onboarding'
import { BrowserRouter } from 'react-router-dom'

const mockedUsedNavigate = vi.fn()

describe('Welcome page test', () => {
  test('User has completed the onboarding previously', () => {
    beforeAll(() => {
      vi.restoreAllMocks()
      vi.mock('../lib/station-config', () => {
        return {
          setOnboardingCompleted: () => Promise.resolve(undefined),
          getOnboardingCompleted: (status: boolean) => Promise.resolve(true),
          getDestinationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa')
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
      vi.clearAllMocks()
      render(<BrowserRouter> <Onboarding /></BrowserRouter >)
    })

    test('redirects to dashboard directly if user is onboarded', async () => {
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(1), { timeout: 3000 })
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/wallet', { replace: true }), { timeout: 3000 })
    })
  })

  test('User has not completed the onboarding', () => {
    beforeAll(() => {
      vi.clearAllMocks()
      vi.mock('../lib/station-config', () => {
        return {
          setOnboardingCompleted: () => Promise.resolve(undefined),
          getOnboardingCompleted: (status: boolean) => Promise.resolve(false),
          getDestinationWalletAddress: () => Promise.resolve(undefined)
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
      vi.restoreAllMocks()
      render(<BrowserRouter> <Onboarding /></BrowserRouter >)
    })

    test('show loading test', () => {
      expect(document.getElementsByClassName('loading')).toHaveLength(1)
    })

    test('loads and show onboarding modal on startup', async () => {
      await waitFor(() => { expect(document.getElementsByClassName('onboarding')).toHaveLength(1) }, { timeout: 3000 })
    })

    test('interact with onboarding slides', async () => {
      await waitFor(() => { expect(screen.getByText(/Back/i).closest('button')).toBeDisabled() }, { timeout: 3000 })
      await waitFor(() => expect(document.getElementsByClassName('onboarding-0')).toHaveLength(1))
      act(() => { fireEvent.click(screen.getByText(/Continue/i)) })
      await waitFor(() => expect(document.getElementsByClassName('onboarding-1')).toHaveLength(1))
      act(() => { fireEvent.click(screen.getByText(/Continue/i)) })
      await waitFor(() => expect(document.getElementsByClassName('onboarding-2')).toHaveLength(1))
      act(() => { fireEvent.click(screen.getByText(/Back/i)) })
      await waitFor(() => expect(document.getElementsByClassName('onboarding-1')).toHaveLength(1))
      act(() => { fireEvent.click(screen.getByText(/Back/i)) })
      await waitFor(() => expect(document.getElementsByClassName('onboarding-0')).toHaveLength(1))
    })

    test('redirects to dashboard on accept', async () => {
      await waitFor(() => expect(document.getElementsByClassName('onboarding-0')).toHaveLength(1), { timeout: 3000 })
      await waitFor(() => act(() => { fireEvent.click(screen.getByText(/Continue/i)) }))
      await waitFor(() => act(() => { fireEvent.click(screen.getByText(/Continue/i)) }))
      await waitFor(() => act(() => { fireEvent.click(screen.getByTitle(/accept/i)) }))
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(1)
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/wallet', { replace: true })
    })
  })

  test('User has completed the onboarding and set up wallet previously', () => {
    beforeAll(() => {
      vi.clearAllMocks()
      vi.mock('../lib/station-config', () => {
        return {
          getDestinationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
          setOnboardingCompleted: () => Promise.resolve(undefined),
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
      render(<BrowserRouter> <Onboarding /></BrowserRouter >)
    })

    test('redirects to dashboard directly if user is onboarded', async () => {
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(1), { timeout: 3000 })
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true }), { timeout: 3000 })
    }, { timeout: 10000 })
  })
})
