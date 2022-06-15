export declare global {
  interface Window {
    electron: {
      startSaturnNode: () => Promise<void>
      stopSaturnNode: () => Promise<void>
      isSaturnNodeRunning: () => Promise<boolean>
      isSaturnNodeReady: () => Promise<boolean>
      getSaturnNodeWebUrl: () => Promise<string>
    }
  }
}
