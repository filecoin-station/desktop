import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'src/lib/station-config'
import Dashboard from 'src/pages/dashboard/Dashboard'
import useStationActivity from 'src/hooks/StationActivity'
import useWallet from 'src/hooks/StationWallet'
import useStationRewards from 'src/hooks/StationRewards'
import { renderApp, stubGlobalElectron } from './helpers'

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

stubGlobalElectron()

describe('Dashboard wallet display', () => {
  beforeEach(() => {
    vi.clearAllMocks()

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

    renderApp(<Dashboard />)
  })

  test('Clicking wallet widget opens modal', async () => {
    expect(screen.getByTestId('wallet-widget')).toBeInTheDocument()

    act(() => { fireEvent.click(screen.getByTestId('wallet-widget')) })
    expect(screen.getByRole('dialog')).toBeVisible()
  })

  test('Wallet displays internal address', () => {
    expect(screen.getByTestId('wallet-widget')).toBeInTheDocument()

    act(() => { fireEvent.click(screen.getByTestId('wallet-widget')) })

    expect(screen.getByText('f16m5s...ron4qa')).toBeVisible()
  })

  test('Wallet displays correct balance', () => {
    expect(screen.getByTestId('wallet-widget')).toBeInTheDocument()

    act(() => { fireEvent.click(screen.getByTestId('wallet-widget')) })

    expect(screen.getAllByText(/0 FIL/)[0]).toBeInTheDocument()
  })
})
