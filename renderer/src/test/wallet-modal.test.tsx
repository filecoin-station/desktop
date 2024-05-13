import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'src/lib/station-config'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from 'src/pages/dashboard/Dashboard'
import Layout from 'src/components/Layout'
import { DialogProvider } from 'src/components/DialogProvider'
import useStationActivity from 'src/hooks/StationActivity'
import useWallet from 'src/hooks/StationWallet'
import useStationRewards from 'src/hooks/StationRewards'

const mockedSetDestinationWalletAddress = vi.fn()

vi.mock('src/lib/station-config', () => ({
  getStationWalletBalance: () => Promise.resolve(0),
  getStationWalletTransactionsHistory: () => Promise.resolve([]),
  getStationWalletAddress: () => Promise.resolve('f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa'),
  getDestinationWalletAddress: () => Promise.resolve(''),
  setDestinationWalletAddress: () => mockedSetDestinationWalletAddress,
  getScheduledRewards: () => Promise.resolve('0.0'),
  getActivities: () => Promise.resolve([]),
  openBeryx: () => Promise.resolve()
}))
vi.mock('src/hooks/StationWallet')
vi.mock('src/hooks/StationActivity')
vi.mock('src/hooks/StationRewards')

describe('Dashboard wallet display', () => {
  describe('Wallet modal empty state', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      vi.stubGlobal('electron', {
        stationEvents: {
          onActivityLogged: vi.fn(),
          onEarningsChanged: vi.fn(),
          onJobProcessed: vi.fn(),
          onReadyToUpdate: vi.fn(),
          onTransactionUpdate: vi.fn(),
          onBalanceUpdate: vi.fn(),
          onScheduledRewardsUpdate: vi.fn()
        },
        getUpdaterStatus: vi.fn(async () => ({ readyToUpdate: false }))
      })

      vi.mocked(useWallet).mockReturnValue({
        stationAddress: 'f16m5slrkc6zumruuhdzn557a5sdkbkiellron4qa',
        stationAddress0x: '0x000000000000000000000000000000000000dEaD',
        destinationFilAddress: '',
        walletBalance: '0',
        walletTransactions: [],
        editDestinationAddress: (value?: string) => null,
        processingTransaction: undefined,
        dismissCurrentTransaction: () => ({}),
        transferAllFundsToDestinationWallet: async () => undefined
      })

      vi.mocked(useStationActivity).mockReturnValue({
        totalJobs: 0,
        activities: []
      })
      vi.mocked(useStationRewards).mockReturnValue({
        totalRewardsReceived: 1,
        scheduledRewards: undefined,
        historicalRewards: []
      })

      render(<BrowserRouter><DialogProvider><Layout><Dashboard /></Layout></DialogProvider></BrowserRouter>)
    })

    test('Clicking wallet widget opens modal', async () => {
      expect(document.getElementsByClassName('wallet-widget')).toHaveLength(1)

      act(() => { fireEvent.click(document.getElementsByClassName('wallet-widget')[0]) })
      expect(screen.getByRole('dialog')).toBeVisible()
    })

    test('Wallet displays internal address', () => {
      expect(document.getElementsByClassName('wallet-widget')).toHaveLength(1)

      act(() => { fireEvent.click(document.getElementsByClassName('wallet-widget')[0]) })

      expect(screen.getByText('f16m5s...ron4qa')).toBeVisible()
    })

    test('Wallet displays correct balance', () => {
      expect(document.getElementsByClassName('wallet-widget')).toHaveLength(1)

      act(() => { fireEvent.click(document.getElementsByClassName('wallet-widget')[0]) })

      expect(screen.getByText(/0 FIL/)).toBeVisible()
    })
  })
})
