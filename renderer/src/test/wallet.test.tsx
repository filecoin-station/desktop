import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import '../lib/station-config'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

describe('Dashboard wallet display', () => {
  // beforeEach(() => {
  //   vi.restoreAllMocks()
  // })

  describe('Wallet modal empty state', () => {
    const mockedSetDestinationWalletAddress = vi.fn((addresss: string | undefined) => ({}))
    const onActivityLogged = vi.fn((callback) => () => ({}))
    const onEarningsChanged = vi.fn((callback) => () => ({}))
    const onJobProcessed = vi.fn((callback) => () => ({}))
    const onUpdateAvailable = vi.fn((callback) => () => ({}))
    const onTransactionUpdate = vi.fn((callback) => () => ({}))
    const onBalanceUpdate = vi.fn((callback) => () => ({}))

    beforeAll(() => {
      vi.mock('../lib/station-config', () => {
        return {
          getStationWalletBalance: () => Promise.resolve(0),
          getStationWalletTransactionsHistory: () => Promise.resolve([]),
          getStationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
          getDestinationWalletAddress: () => Promise.resolve(''),
          setDestinationWalletAddress: () => mockedSetDestinationWalletAddress,
          getTotalJobsCompleted: () => Promise.resolve(0),
          getTotalEarnings: () => Promise.resolve(0),
          getAllActivities: () => Promise.resolve([])
        }
      })
    })

    beforeEach(() => {
      vi.clearAllMocks()
      Object.defineProperty(window, 'electron', {
        writable: true,
        value: {
          stationEvents: {
            onActivityLogged,
            onEarningsChanged,
            onJobProcessed,
            onUpdateAvailable,
            onTransactionUpdate,
            onBalanceUpdate
          },
          getUpdaterStatus: vi.fn(() => Promise.resolve(false)),
          dialogs: {
            confirmChangeWalletAddress: () => Promise.resolve(true)
          }
        }
      })
      act(() => { render(<BrowserRouter><Dashboard /></BrowserRouter>) })
    })

    test('Wallet curtain opens on click widget and closes on click background shadow', () => {
      expect(document.getElementsByClassName('wallet-widget')).toHaveLength(1)

      expect(document.getElementsByClassName('modal-bg')).toHaveLength(1)
      expect(document.getElementsByClassName('modal-bg')[0]).toHaveClass('invisible')
      expect(document.getElementsByClassName('modal-content')).toHaveLength(1)
      expect(document.getElementsByClassName('modal-content')[0]).toHaveClass('invisible')

      act(() => { fireEvent.click(document.getElementsByClassName('wallet-widget')[0]) })
      expect(document.getElementsByClassName('modal-bg')[0]).not.toHaveClass('invisible')
      expect(document.getElementsByClassName('modal-content')[0]).not.toHaveClass('invisible')

      act(() => { fireEvent.click(document.getElementsByClassName('modal-bg')[0]) })
      expect(document.getElementsByClassName('modal-bg')[0]).toHaveClass('invisible')
      expect(document.getElementsByClassName('modal-content')[0]).toHaveClass('invisible')
    })

    test('Wallet displays internal address', () => {
      expect(document.getElementsByClassName('station-address')[0]).toHaveTextContent('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa')
    })

    test('Wallet displays empty destination address', () => {
      expect(document.getElementsByClassName('destination-address')[0]).toHaveValue('')
    })

    test('Wallet displays correct balance', () => {
      expect(document.getElementsByClassName('wallet-balance')[0].textContent).toBe('0.000FIL')
    })

    test('Wallet withdraws disabled', () => {
      expect(document.getElementsByClassName('destination-address')[0]).toHaveValue('')
      expect(document.getElementsByClassName('wallet-transfer-start')[0]).toBeDisabled()
      expect(document.getElementsByClassName('wallet-transfer-tooltip')[0]).toBeVisible()
    })

    test('Wallet displays onboarding', () => {
      expect(document.getElementsByClassName('wallet-onboarding')[0]).toHaveClass('visible')
      expect(document.getElementsByClassName('wallet-history')[0]).toHaveClass('invisible')
      expect(document.getElementsByClassName('wallet-transaction').length).toBe(0)
    })

    test('Wallet setup destination address', () => {
      fireEvent.click(document.getElementsByClassName('address-edit')[0])
      waitFor(() => expect(document.getElementsByClassName('submit-address')[0]).toBeDisabled())
      fireEvent.change(document.getElementsByClassName('destination-address')[0], { target: { value: 'f0111' } })
      expect(document.getElementsByClassName('destination-address')[0]).toHaveValue('f0111')
      expect(document.getElementsByClassName('submit-address')[0]).not.toBeDisabled()
      fireEvent.click(document.getElementsByClassName('submit-address')[0])
      waitFor(() => { expect(mockedSetDestinationWalletAddress).toHaveBeenCalled() })
    })
  })
})
