import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import '../lib/station-config'
import Onboarding from '../pages/Onboarding'
import { BrowserRouter } from 'react-router-dom'

const mockedUsedNavigate = vi.fn()

describe('Onboarding page test', () => {
  beforeAll(() => {
    vi.clearAllMocks()
    vi.mock('../lib/station-config', () => {
      return {
        setOnboardingCompleted: () => Promise.resolve(undefined),
        getOnboardingCompleted: (status: boolean) => Promise.resolve(false),
        getFilAddress: () => Promise.resolve(undefined)
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
    await waitFor(() => act(() => { fireEvent.click(screen.getByText(/Accept/i)) }))
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1)
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/wallet', { replace: true })
  })
})
