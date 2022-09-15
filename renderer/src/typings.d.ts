import { Activity } from '../main/typings'

export declare global {
  interface Window {
    electron: {
      getAllActivities(): Promise<Activity[]>,
      onActivityLogged(callback: (allActivities: Activity[]) => void),

      saturnNode: {
        start:() => Promise<void>,
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
        setOnboardingCompleted: () => Promise<void>,
        getUserConsent: () => Promisse<boolean>,
        setUserConsent: (consent: boolean) => Promisse<void>
      }
    }
  }
}
