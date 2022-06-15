export declare global {
  interface Window {
    electron: {
      startSaturnNode: () => Promise<void>
      stopSaturnNode: () => Promise<void>
      isSaturnNodeOn: () => Promise<boolean>
    }
  }
}
