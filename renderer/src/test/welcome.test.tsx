import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Welcome from './../pages/Welcome'
import '@testing-library/jest-dom'
import './../components/InterfaceCalls'
import { BrowserRouter } from 'react-router-dom'

vi.mock('./../components/InterfaceCalls', () => {
  return {
    getStationFilAddress: () => Promise.resolve(undefined),
    setStationFilAddress: (address: string | undefined) => Promise.resolve(undefined)
  }
})

describe('Welcome page test', () => {
  beforeEach(() => {
    render(<BrowserRouter><Welcome /></BrowserRouter>)
  })

  test('show loading test', () => {
    expect(screen.getByText(/Loading.../i)).toBe
  })

  test('loads modal and show onboarding modal on startup', () => {
    expect(screen.getByTestId('modal-element')).toBe
    expect(screen.getByTestId('onboarding-element')).toBeVisible
  })

  test('interact with onboarding slides inside modal', () => {
    waitFor(() => {
      fireEvent.click(screen.getByText(/Next/i))
      expect(screen.getByText(/Got It/i)).toBeInTheDocument()
      fireEvent.click(screen.getByText(/Got It/i))
    })

    expect(screen.getByTestId('onboarding-element')).not.toBeVisible
  })

  test('display error validation messages', () => {
    const addressInput = screen.getByTestId('input-address-element')

    fireEvent.change(addressInput, { target: { value: '123' } })
    expect(screen.getByDisplayValue('123')).toBe(addressInput)
    fireEvent.click(screen.getByTitle('connect'))
    expect(screen.getByTitle('validation error').textContent).toBe('Unknown address coinType.')

    fireEvent.change(addressInput, { target: { value: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4q' } })
    fireEvent.click(screen.getByTitle('connect'))
    expect(screen.getByTitle('validation error').textContent).toBe('Invalid secp256k1 address length.')
  })

  test('display consent modal when address is valid', () => {
    const addressInput = screen.getByTestId('input-address-element')

    fireEvent.change(addressInput, { target: { value: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa' } })
    fireEvent.click(screen.getByTitle('connect'))
    expect(screen.getByTestId('modal-element')).toBeVisible
    expect(screen.getByTestId('consent-element')).toBeVisible
  })

  test('reject consent modal', () => {
    const addressInput = screen.getByTestId('input-address-element')

    fireEvent.change(addressInput, { target: { value: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa' } })
    fireEvent.click(screen.getByTitle('connect'))
    fireEvent.click(screen.getByTitle('reject'))
    expect(screen.getByTestId('modal-element')).not.toBeVisible
    expect(screen.getByTestId('consent-element')).not.toBeVisible
  })

  test('accept consent modal', async () => {
    const addressInput = screen.getByTestId('input-address-element')

    fireEvent.change(addressInput, { target: { value: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa' } })
    fireEvent.click(screen.getByTitle('connect'))
    fireEvent.click(screen.getByTitle('accept'))
  })
})
