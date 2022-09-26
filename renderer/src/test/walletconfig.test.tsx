import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import '../lib/station-config'
import { BrowserRouter } from 'react-router-dom'
import WalletConfig from '../pages/WalletConfig'

vi.mock('../lib/station-config', () => {
  return {
    getFilAddress: () => Promise.resolve(undefined),
    setFilAddress: (address: string | undefined) => Promise.resolve(undefined)
  }
})

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const router: typeof import('react-router-dom') = await vi.importActual('react-router-dom')
  return {
    ...router,
    useNavigate: () => mockedUsedNavigate
  }
})
const start = vi.fn()
Object.defineProperty(window, 'electron', {
  writable: true,
  value: {
    saturnNode: {
      start
    }
  }
})

describe('WalletConfig page test', () => {
  beforeEach(() => {
    render(<BrowserRouter><WalletConfig /></BrowserRouter>)
  })

  test('display input field', () => {
    expect(document.getElementsByClassName('fil-address').length).toBe(1)
  })

  test('display submit button', () => {
    expect(document.getElementsByClassName('submit-address').length).toBe(1)
  })

  test('error message is not visible', () => {
    expect(screen.queryByTitle('validation error')).toBeNull()
  })

  test('display error validation messages', async () => {
    const addressInput = document.getElementsByClassName('fil-address')[0]

    act(() => { fireEvent.change(document.getElementsByClassName('fil-address')[0], { target: { value: '123' } }) })
    await waitFor(() => { expect(addressInput).toHaveValue('123') })
    act(() => { fireEvent.click(screen.getByTitle('connect')) })
    await waitFor(() => { expect(screen.queryByTitle('validation error')).toBeVisible() })
    await waitFor(() => { expect(screen.getByTitle('validation error').textContent).toBe('Unknown address coinType.') })
    act(() => { fireEvent.change(addressInput, { target: { value: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4q' } }) })
    await waitFor(() => { expect(addressInput).toHaveValue('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4q') })
    act(() => { fireEvent.click(screen.getByTitle('connect')) })
    await waitFor(() => { expect(screen.getByTitle('validation error').textContent).toBe('Invalid secp256k1 address length.') })
  })

  test('navigate to saturn when address is valid', async () => {
    const addressInput = document.getElementsByClassName('fil-address')[0]
    act(() => { fireEvent.change(addressInput, { target: { value: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa' } }) })
    act(() => { fireEvent.click(screen.getByTitle('connect')) })
    await waitFor(() => { expect(mockedUsedNavigate).toHaveBeenCalledTimes(1) })
    await waitFor(() => { expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true }) })
  })
})
