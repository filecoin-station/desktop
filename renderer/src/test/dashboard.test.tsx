import { beforeEach, describe, expect, test, vi } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  getActivities,
  getDestinationWalletAddress,
  getScheduledRewards,
  getStationWalletAddress,
  getStationWalletBalance,
  getStationWalletTransactionsHistory
} from 'src/lib/station-config'
import Dashboard from 'src/pages/dashboard/Dashboard'
import useWallet from 'src/hooks/StationWallet'
import useStationActivity from 'src/hooks/StationActivity'
import { Activity } from '../../../shared/typings'
import useStationRewards from 'src/hooks/StationRewards'
import { stubGlobalElectron, renderApp } from './helpers'
import { useEffect, useState } from 'react'

vi.mock('src/hooks/StationWallet')
vi.mock('src/hooks/StationActivity')
vi.mock('src/hooks/StationRewards')
vi.mock('src/lib/station-config')

stubGlobalElectron()

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Unpopulated', () => {
    beforeAll(() => {
      vi.mocked(getStationWalletBalance).mockReturnValue(Promise.resolve('0'))
      vi.mocked(getStationWalletTransactionsHistory).mockReturnValue(Promise.resolve([]))
      vi.mocked(getStationWalletAddress).mockReturnValue(
        Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa')
      )
      vi.mocked(getDestinationWalletAddress).mockReturnValue(Promise.resolve(''))
      vi.mocked(getActivities).mockReturnValue(Promise.resolve([]))
      vi.mocked(getScheduledRewards).mockReturnValue(Promise.resolve('0.0'))
    })

    beforeEach(() => {
      vi.mocked(useWallet).mockReturnValue({
        stationAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa',
        stationAddress0x: '0x000000000000000000000000000000000000dEaD',
        destinationFilAddress: '',
        walletBalance: '0',
        walletTransactions: [],
        editDestinationAddress: (value?: string) => null,
        dismissCurrentTransaction: () => ({}),
        transferAllFundsToDestinationWallet: async () => undefined,
        processingTransaction: undefined
      })

      vi.mocked(useStationActivity).mockReturnValue({
        totalJobs: 0,
        activities: []
      })
      vi.mocked(useStationRewards).mockReturnValue({
        totalRewardsReceived: 1,
        scheduledRewards: '100',
        historicalRewards: []
      })

      renderApp(<Dashboard />)
    })

    test('display jobs counter', () => {
      expect(screen.getByTestId('jobs-counter').textContent).toBe('0')
    })

    test('displays earnings counter null', () => {
      expect(screen.getByTestId('earnings-counter').textContent).toBe('1 FIL')
    })

    test('displays empty activity log', () => {
      expect(screen.queryAllByTestId('activity-item').length).toBe(0)
    })
  })

  describe('Populated', () => {
    beforeEach(() => {
      vi.useFakeTimers()

      vi.mocked(useWallet).mockReturnValue({
        stationAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa',
        stationAddress0x: '0x000000000000000000000000000000000000dEaD',
        destinationFilAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellfff2rg',
        walletBalance: '0',
        walletTransactions: [],
        editDestinationAddress: () => null,
        dismissCurrentTransaction: () => ({}),
        transferAllFundsToDestinationWallet: async () => undefined,
        processingTransaction: undefined
      })

      vi.mocked(useStationRewards).mockImplementation(() => {
        const [mockedRewards, setMockedRewards] = useState(0)

        useEffect(() => {
          setTimeout(() => {
            setMockedRewards(10)
          }, 100)
        }, [])

        return {
          totalRewardsReceived: mockedRewards,
          scheduledRewards: '100',
          historicalRewards: []
        }
      })

      vi.mocked(useStationActivity).mockImplementation(() => {
        const [mockedActivities, setMockedActivities] = useState<Activity[]>([])
        const [mockedJobs, setMockedJobs] = useState(100)

        useEffect(() => {
          setTimeout(() => {
            setMockedJobs(200)
            setMockedActivities([
              {
                id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39c2',
                timestamp: new Date(166386083297),
                source: 'Saturn',
                type: 'info',
                message: 'Saturn node exited with code: 2'
              },
              {
                id: 'bb9d9a61-75e0-478d-9dd8-aa74756c39f7',
                timestamp: new Date(166386083497),
                source: 'Saturn',
                type: 'info',
                message: 'Some random message for testing'
              }
            ])
          }, 100)
        }, [])

        return {
          totalJobs: mockedJobs,
          activities: mockedActivities
        }
      })

      renderApp(<Dashboard />)
    })

    afterEach(() => {
      vi.clearAllTimers()
      vi.useRealTimers()
    })

    test('subscribes and listens the activity logger', async () => {
      expect(screen.queryAllByTestId('activity-item').length).toBe(0)

      act(() => {
        vi.runAllTimers()
      })

      vi.clearAllTimers()
      vi.useRealTimers()

      await waitFor(() => {
        expect(screen.queryAllByTestId('activity-item').length).toBe(2)
      })
    })

    test('subscribes and listens the jobs counter', async () => {
      expect(screen.getByTestId('jobs-counter').textContent).toBe('100')

      act(() => {
        vi.runAllTimers()
      })

      vi.clearAllTimers()
      vi.useRealTimers()

      await waitFor(() => {
        expect(screen.getByTestId('jobs-counter').textContent).toBe('200')
      })
    })

    test('subscribes and listens the earnings counter', async () => {
      expect(screen.getByTestId('earnings-counter').textContent).toBe('0 FIL')

      act(() => {
        vi.runAllTimers()
      })

      vi.clearAllTimers()
      vi.useRealTimers()

      await waitFor(() => {
        expect(screen.getByTestId('earnings-counter').textContent).toBe('10 FIL')
      })
    })
  })
})
