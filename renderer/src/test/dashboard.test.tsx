import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import '../lib/station-config'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const activities = [{
  id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39c2',
  timestamp: 166386083297,
  source: 'Saturn',
  type: 'info',
  message: 'Saturn node exited with code: 2'
}]
const addToActivities = () => {
  activities.push({
    id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39c3',
    timestamp: 166386083298,
    source: 'Saturn',
    type: 'info',
    message: 'Saturn node exited with code: 2'
  })
}

let totalJobs = 100
const setTotalJobs = () => {
  totalJobs = 200
}

let totalEarnings = 100
const setTotalEarnings = () => {
  totalEarnings = 200
}

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Unpopulated', () => {
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
          getTotalJobsCompleted: () => Promise.resolve(0),
          getTotalEarnings: () => Promise.resolve(0),
          getAllActivities: () => Promise.resolve([])
        }
      })
    })

    beforeEach(() => {
      vi.mock('../hooks/StationWallet', async () => {
        return {
          default: () => {
            let destination = ''
            return {
              stationAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa',
              destinationFilAddress: destination,
              walletBalance: 0,
              walletTransactions: [],
              editDestinationAddress: (value: string) => { destination = value },
              currentTransaction: undefined,
              dismissCurrentTransaction: () => ({})
            }
          }
        }
      })

      vi.mock('../hooks/StationActivity', async () => {
        return {
          default: () => ({
            totalJobs: 0,
            totalEarnings: 0,
            activities: []
          })
        }
      })

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
          getUpdaterStatus: vi.fn(() => new Promise((resolve, reject) => ({}))),
          dialogs: {
            confirmChangeWalletAddress: () => Promise.resolve(true)
          }
        }
      })
      render(<BrowserRouter><Dashboard /></BrowserRouter>)
    })

    test('display jobs counter', () => {
      waitFor(() => { expect(document.getElementsByClassName('total-jobs')[0].textContent).toBe('0') })
    })

    test('displays earnings counter null', () => {
      waitFor(() => { expect(document.getElementsByClassName('total-earnings')[0].textContent).toBe('--') })
    })

    test('displays empty activty log', () => {
      expect(document.getElementsByClassName('activity-item').length).toBe(0)
    })
  })

  describe('Populated', () => {
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
      setTimeout(() => act(() => callback(value)))
      return () => ({})
    })

    const onEarningsChanged = vi.fn((callback) => {
      const value = 200
      setTimeout(() => { act(() => callback(value)) })
      return () => ({})
    })

    const onJobProcessed = vi.fn((callback) => {
      const value = 200
      setTimeout(() => { act(() => callback(value)) })
      return () => ({})
    })

    const onUpdateAvailable = vi.fn((callback) => () => ({}))
    const onTransactionUpdate = vi.fn((callback) => () => ({}))
    const onBalanceUpdate = vi.fn((callback) => () => ({}))
    const getUpdaterStatus = vi.fn(() => new Promise((resolve, reject) => ({})))

    beforeEach(() => {
      vi.mock('../hooks/StationWallet', async () => {
        return {
          default: () => {
            return {
              stationAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa',
              destinationFilAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellfff2rg',
              walletBalance: 0,
              walletTransactions: [],
              editDestinationAddress: () => ({}),
              currentTransaction: undefined,
              dismissCurrentTransaction: () => ({})
            }
          }
        }
      })

      vi.mock('../hooks/StationActivity', async () => {
        return {
          default: () => ({
            totalJobs,
            totalEarnings,
            activities
          })
        }
      })

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
          getUpdaterStatus
        }
      })
      render(<BrowserRouter><Dashboard /></BrowserRouter>)
    })

    test('subscribes and listens the activity logger', () => {
      onActivityLogged(addToActivities)
      waitFor(() => { expect(onActivityLogged).toBeCalledTimes(1) }, { timeout: 10 })
      waitFor(() => { expect(document.getElementsByClassName('activity-item').length).toBe(2) }, { timeout: 3000 })
    })

    test('subscribes and listens the jobs counter', () => {
      onJobProcessed(setTotalJobs)
      waitFor(() => { expect(onJobProcessed).toBeCalledTimes(1) }, { timeout: 10 })
      waitFor(() => { expect((screen.getByTitle('total jobs')).textContent).toBe('200') }, { timeout: 1000 })
    })

    test('subscribes and listens the earnings counter', () => {
      onEarningsChanged(setTotalEarnings)
      waitFor(() => { expect(onEarningsChanged).toBeCalledTimes(1) }, { timeout: 10 })
      waitFor(() => { expect((screen.getByTitle('total earnings')).textContent).toBe('200FIL') }, { timeout: 1000 })
    })
  })
})
