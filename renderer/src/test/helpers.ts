import { vi } from 'vitest'

export function setupElectronStub () {
  const onActivityLogged = vi.fn((callback) => () => ({}))
  const onJobProcessed = vi.fn((callback) => () => ({}))
  const onReadyToUpdate = vi.fn((callback) => () => ({}))
  const onTransactionUpdate = vi.fn((callback) => () => ({}))
  const onBalanceUpdate = vi.fn((callback) => () => ({}))
  const onScheduledRewardsUpdate = vi.fn((callback) => () => ({}))

  vi.stubGlobal('electron', {
    stationEvents: {
      onActivityLogged,
      onJobProcessed,
      onReadyToUpdate,
      onTransactionUpdate,
      onScheduledRewardsUpdate,
      onBalanceUpdate
    },
    getUpdaterStatus: vi.fn(() => new Promise((resolve, reject) => ({})))
  })
}
