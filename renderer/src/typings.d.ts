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
        getStationWalletBalance: () => Promise<string>,
        getStationWalletTransactionsHistory: () => Promise<(FILTransaction|FILTransactionProcessing)[]>,
        transferAllFundsToDestinationWallet: () => Promise<void>,
        browseTransactionTracker: (transactionHash: string) => void
      },
      stationEvents: {
        onActivityLogged: (callback) => () => void,
        onJobProcessed: (callback) => () => void,
        onEarningsChanged: (callback) => () => void,
        onUpdateAvailable: (callback: () => void) => () => void,
        onTransactionUpdate (callback: (allTransactions: (FILTransaction|FILTransactionProcessing)[]) => void),
        onBalanceUpdate (callback: (balance: string) => void)
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
  height: number
  timestamp: number
  status: TransactionStatus
  outgoing: boolean
  amount: string
  address: string
}

// helper
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// FILTransaction with certain properties changed to optional
type FILTransactionProcessing = PartialBy<FILTransaction, 'hash' | 'height'>
type FILTransactionLoading = PartialBy<FILTransaction, 'status' | 'timestamp'>
