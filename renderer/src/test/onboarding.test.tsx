import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import '../lib/station-config'
import Onboarding from '../pages/Onboarding'
import { BrowserRouter } from 'react-router-dom'

const mockedUsedNavigate = vi.fn()

describe('Welcome page test', () => {
  describe('User have not completed the onboarding', () => {
    vi.mock('../lib/station-config', () => {
      return {
        setOnboardingCompleted: () => Promise.resolve(undefined),
        getOnboardingCompleted: (status: boolean) => Promise.resolve(false)
      }
    })

    vi.mock('react-router-dom', async () => {
      const router: typeof import('react-router-dom') = await vi.importActual('react-router-dom')
      return {
        ...router,
        useNavigate: () => mockedUsedNavigate
      }
    })

    beforeEach(() => {
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
      await waitFor(() => act(() => { fireEvent.click(screen.getByText(/Accept/i)) }))
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(1)
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/wallet', { replace: true })
    })
  })

  describe('User have completed the onboarding previously', () => {
    vi.mock('../lib/station-config', () => {
      return {
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

    beforeAll(() => {
      render(<BrowserRouter> <Onboarding /></BrowserRouter >)
    })

    test('redirects to dashboard directly if user is onboarded', async () => {
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(1), { timeout: 3000 })
      await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/wallet', { replace: true }), { timeout: 3000 })
    })
  })
})
