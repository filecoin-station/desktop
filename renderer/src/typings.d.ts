export declare global {
  interface Window {
    electron: {
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
        getSawOnboarding: () => Promise<boolean>,
        setSawOnboarding: () => Promise<void>,
        getUserConsent: () => Promisse<boolean>,
        setUserConsent: (consent: boolean) => Promisse<void>
      },
      stationEvents: {
        onActivityLog: (callback) => () => void
        onJobsCounter: (callback) => () => void
        onEarningsCounter: (callback) => () => void
      }
    }
  }
}

export type ActivityEventMessage = {
  time: EpochTimeStamp,
  type: 'info' | 'error' | 'warning' | undefined,
  msg: string
}
