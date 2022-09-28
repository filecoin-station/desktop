import { Activity } from '../main/typings'

export declare global {
  interface Window {
    electron: {
      stationBuildVersion: string,

      getAllActivities(): Promise<Activity[]>,
      onActivityLogged(callback: (allActivities: Activity[]) => void),

      getTotalJobsCompleted(): Promise<number>,
      onJobStatsUpdated (callback: (totalJobCount: number) => void),

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
        getFilAddress: () => Promise<string | undefined>,
        setFilAddress: (address: string | undefined) => Promise<void>,
        getOnboardingCompleted: () => Promise<boolean>,
        setOnboardingCompleted: () => Promise<void>
      },
      stationEvents: {
        onActivityLogged: (callback) => () => void
        onJobProcessed: (callback) => () => void
        onEarningsChanged: (callback) => () => void
      },
      dialogs: {
        confirmChangeWalletAddress: () => Promise<boolean>
      }
    }
  }
}

export type ActivityEventMessage = {
  id: string;
  timestamp: number;
  type: string;
  source: string;
  message: string;
}
