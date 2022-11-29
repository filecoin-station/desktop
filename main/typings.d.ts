export type ActivitySource = 'Station' | 'Saturn';
export type ActivityType = 'info' | 'error';
export type TransactionStatus = 'sent' | 'processing' | 'failed'

export interface Activity {
  id: string;
  timestamp: number;
  type: ActivityType;
  source: ActivitySource;
  message: string;
}

export type FILTransaction = {
  hash: string
  timestamp: number
  status: TransactionStatus
  outgoing: boolean
  amount: string
  address: string
}

export type RecordActivityArgs = Omit<Activity, 'id' | 'timestamp'>;

export type ModuleJobStatsMap = Record<string, number>;

export interface Context {
  recordActivity(activity: RecordActivityArgs): void;
  getAllActivities(): Activity[];

  setModuleJobsCompleted(moduleName: string, count: number): void;
  getTotalJobsCompleted(): number;

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void,
  saveSaturnModuleLogAs: () => Promise<void>,
  confirmChangeWalletAddress: () => boolean,

  openReleaseNotes: () => void,
  restartToUpdate: () => void,
  getUpdaterStatus: () => {updateAvailable: boolean},
  browseTransactionTracker: (transactionHash: string) => void
}
