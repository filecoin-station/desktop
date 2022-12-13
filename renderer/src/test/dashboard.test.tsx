import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import '../lib/station-config'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const getUpdaterStatus = vi.fn(() => Promise.resolve(false))

describe('Dashboard page', () => {
  test('Unpopulated', () => {
    const onActivityLogged = vi.fn((callback) => () => ({}))
    const onEarningsChanged = vi.fn((callback) => () => ({}))
    const onJobProcessed = vi.fn((callback) => () => ({}))

    beforeAll(() => {
      vi.restoreAllMocks()
      vi.mock('../lib/station-config', () => {
        return {
          getStationWalletBalance: () => Promise.resolve(0),
          getStationWalletTransactionsHistory: () => Promise.resolve([]),
          getStationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
          getDestinationWalletAddress: () => Promise.resolve(''),
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
            onUpdateAvailable: vi.fn((callback) => () => ({})),
            onTransactionUpdate: vi.fn((callback) => () => ({})),
            onBalanceUpdate: vi.fn((callback) => () => ({}))
          },
          getUpdaterStatus: vi.fn(() => Promise.resolve(false)),
          dialogs: {
            confirmChangeWalletAddress: () => Promise.resolve(true)
          }
        }
      })
      act(() => { render(<BrowserRouter><Dashboard /></BrowserRouter>) })
    })
    test('display jobs counter', async () => {
      await waitFor(() => { expect((screen.getByTitle('total jobs')).textContent).toBe('0') })
    })

    test('displays earnings counter null', async () => {
      await waitFor(() => { expect((screen.getByTitle('total earnings')).textContent).toBe('--') })
    })

    test('displays empty activty log', () => {
      expect(document.getElementsByClassName('activity-item').length).toBe(0)
    })
  })

  test('Populated', () => {
    const onActivityLogged = vi.fn((callback) => {
      const value = [{
        id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39c2',
        timestamp: 166386083297,
        source: 'Saturn',
        type: 'info',
        message: 'Saturn node exited with code: 2'
      },
      {
        id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39f7',
        timestamp: 166386083497,
        source: 'Saturn',
        type: 'info',
        message: 'Some random message for testing'
      }]
      setTimeout(() => callback(value))
      return () => ({})
    })

    const onEarningsChanged = vi.fn((callback) => {
      const value = 200
      setTimeout(() => { callback(value) })
      return () => ({})
    })

    const onJobProcessed = vi.fn((callback) => {
      const value = 200
      setTimeout(() => { callback(value) })
      return () => ({})
    })

    const onUpdateAvailable = vi.fn((callback) => () => ({}))

    beforeAll(() => {
      vi.restoreAllMocks()
      vi.mock('../lib/station-config', () => {
        return {
          getStationWalletBalance: () => Promise.resolve(0),
          getStationWalletTransactionsHistory: () => Promise.resolve([]),
          getStationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
          getDestinationWalletAddress: () => Promise.resolve(''),
          getTotalJobsCompleted: () => Promise.resolve(100),
          getTotalEarnings: () => Promise.resolve(100),
          getAllActivities: () => Promise.resolve([
            {
              id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39c2',
              timestamp: 166386083297,
              source: 'Saturn',
              type: 'info',
              message: 'Saturn node exited with code: 2'
            }
          ])
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
            onTransactionUpdate: vi.fn((callback) => () => ({})),
            onBalanceUpdate: vi.fn((callback) => () => ({}))
          },
          getUpdaterStatus
        }
      })
      act(() => { render(<BrowserRouter><Dashboard /></BrowserRouter>) })
    })

    test('subscribes and listens the activity logger', async () => {
      await waitFor(() => { expect(onActivityLogged).toBeCalledTimes(1) }, { timeout: 10 })
      await waitFor(() => { expect(document.getElementsByClassName('activity-item').length).toBe(2) }, { timeout: 3000 })
    })

    test('subscribes and listens the jobs counter', async () => {
      await waitFor(() => { expect(onJobProcessed).toBeCalledTimes(1) }, { timeout: 10 })
      await waitFor(() => { expect((screen.getByTitle('total jobs')).textContent).toBe('200') }, { timeout: 1000 })
    })

    test('subscribes and listens the earnings counter', async () => {
      await waitFor(() => { expect(onEarningsChanged).toBeCalledTimes(1) }, { timeout: 10 })
      await waitFor(() => { expect((screen.getByTitle('total earnings')).textContent).toBe('200FIL') }, { timeout: 1000 })
    })
  })
})
