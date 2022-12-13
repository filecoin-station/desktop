import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import '../lib/station-config'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

describe('Dashboard wallet interactions', () => {
  // beforeEach(() => {
  //   vi.restoreAllMocks()
  // })

  const mockedTransferAllFunds = vi.fn()

  describe('Wallet with transactions and balance', () => {
    const onActivityLogged = vi.fn((callback) => () => ({}))
    const onEarningsChanged = vi.fn((callback) => () => ({}))
    const onJobProcessed = vi.fn((callback) => () => ({}))
    const onUpdateAvailable = vi.fn((callback) => () => ({}))
    const onTransactionUpdate = vi.fn((callback) => () => ({}))
    const onBalanceUpdate = vi.fn((callback) => () => ({}))

    beforeAll(() => {
      vi.mock('../lib/station-config', () => {
        return {
          getStationWalletBalance: () => Promise.resolve(9.999),
          getStationWalletTransactionsHistory: () => Promise.resolve([
            {
              hash: 'bafy2bzacebi5g5t5x77aeuviwfx5np4xo2f6viunt4bjnnecfjbjqzhufxfk2',
              timestamp: new Date('01/12/2022'),
              status: 'sent',
              outgoing: true,
              amount: 4000,
              address: 'f0123'
            },
            {
              hash: 'bafy2bzacebi5g5t5x77aeuviwfx5np4xo2f6viunt4bjnnecfjbjqzhufxfk3',
              timestamp: new Date('01/01/2022'),
              status: 'sent',
              outgoing: false,
              amount: 4000,
              address: ''
            }
          ]),
          getStationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
          getDestinationWalletAddress: () => Promise.resolve('f0123'),
          setDestinationWalletAddress: () => () => Promise.resolve(),
          getTotalJobsCompleted: () => Promise.resolve(0),
          getTotalEarnings: () => Promise.resolve(0),
          getAllActivities: () => Promise.resolve([]),
          trasnferAllFundsToDestinationWallet: () => mockedTransferAllFunds()
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
      render(<BrowserRouter><Dashboard /></BrowserRouter>)
    })

    test('Wallet displays correct balance', () => {
      expect(document.getElementsByClassName('wallet-balance')[0].textContent).toBe('9.999FIL')
    })

    test('Wallet displays destination address', () => {
      waitFor(() => expect(document.getElementsByClassName('destination-address')[0]).toHaveValue('f0123'))
    })

    test('Wallet displays correct history', () => {
      expect(document.getElementsByClassName('wallet-onboarding')[0]).toHaveClass('invisible')
      expect(document.getElementsByClassName('wallet-history')[0]).toHaveClass('visible')
      expect(document.getElementsByClassName('wallet-transaction').length).toBe(2)
    })

    test('Wallet withdraw', () => {
      expect(document.getElementsByClassName('wallet-transfer-start')[0]).not.toBeDisabled()
      expect(document.getElementsByClassName('wallet-transfer-tooltip').length).toBe(0)
      act(() => { fireEvent.click(document.getElementsByClassName('wallet-transfer-start')[0]) })
      waitFor(() => expect(document.getElementsByClassName('wallet-transfer-start')[0]).toHaveClass('invisible'))
      waitFor(() => expect(document.getElementsByClassName('wallet-transfer-confirm')[0]).toHaveClass('visible'))
      waitFor(() => expect(document.getElementsByClassName('wallet-transfer-confirm')[0]).not.toBeDisabled())
      waitFor(() => expect(document.getElementsByClassName('wallet-transfer-cancel')[0]).toHaveClass('visible'))
      act(() => { fireEvent.click(document.getElementsByClassName('wallet-transfer-confirm')[0]) })
      waitFor(() => expect(mockedTransferAllFunds).toHaveBeenCalled())
    })
  })
})
