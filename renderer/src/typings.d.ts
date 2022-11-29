import { Activity } from '../main/typings'

export declare global {
  interface Window {
    electron: {
      stationBuildVersion: string,

      getAllActivities(): Promise<Activity[]>,
      onActivityLogged(callback: (allActivities: Activity[]) => void),

      getTotalJobsCompleted(): Promise<number>,
      onJobStatsUpdated (callback: (totalJobCount: number) => void),

      getUpdaterStatus(): Promise<{updateAvailable: boolean}>,
      openReleaseNotes(): void,
      restartToUpdate(): void,

      saturnNode: {
        start: () => Promise<void>,
        stop: () => Promise<void>,
        isRunning: () => Promise<boolean>,
        isReady: () => Promise<boolean>,
        getLog: () => Promise<string>,
        getWebUrl: () => Promise<string>,
        getFilAddress: () => Promise<string | undefined>,
        setFilAddress: (address: string | undefined) => Promise<void>
      },
      stationConfig: {
        getOnboardingCompleted: () => Promise<boolean>,
        setOnboardingCompleted: () => Promise<void>
        getStationWalletAddress: () => Promise<string>,
        getDestinationWalletAddress: () => Promise<string | undefined>,
        setDestinationWalletAddress: (address: string | undefined) => Promise<void>,
        getStationWalletBalance: () => Promise<number>,
        getStationWalletTransactionsHistory: () => Promise<TransactionMessage[]>,
        trasnferAllFundsToDestinationWallet: () => Promise<void>,
        browseTransactionTracker: (transactionHash: string) => void
      },
      stationEvents: {
        onActivityLogged: (callback) => () => void,
        onJobProcessed: (callback) => () => void,
        onEarningsChanged: (callback) => () => void,
        onUpdateAvailable: (callback: () => void) => () => void,
        onTransactionUpdate (callback: (allTransactions: TransactionMessage[]) => void),
        onBalanceUpdate (callback: (balance: number) => void)
      },
      dialogs: {
        confirmChangeWalletAddress: () => Promise<boolean>
      }
    }
  }
}

export type ActivityEventMessage = {
  id: string
  timestamp: number
  type: string
  source: string
  message: string
}

export type FILTransactionStatus = 'sent' | 'processing' | 'failed'

export type FILTransaction = {
  hash: string
  timestamp: number
  status: TransactionStatus
  outgoing: boolean
  amount: string
  address: string
}
