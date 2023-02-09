export type ActivitySource = 'Station' | 'Saturn';
export type ActivityType = 'info' | 'error';
export type TransactionStatus = 'succeeded' | 'processing' | 'failed'

export interface Activity {
  id: string;
  timestamp: number;
  type: ActivityType;
  source: ActivitySource;
  message: string;
}

export type FILTransaction = {
  hash: string;
  height: number;
  timestamp: number;
  status: TransactionStatus;
  outgoing: boolean;
  amount: string;
  address: string;
  error?: string;
}

// helper
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// FILTransaction with certain properties changed to optional
// A processing transaction can have all statuses, because we're briefly showing
// succeeded and failed ones in the same place as the processing one.
export type FILTransactionProcessing = PartialBy<FILTransaction, 'hash' | 'height'>;

export interface FoxMessage {
  cid: string;
  to: string;
  from: string;
  nonce: number;
  height: number;
  method: string;
  value: string;
  timestamp: number;
  receipt: {
    exitCode: number;
  }
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
  browseTransactionTracker: (transactionHash: string) => void,

  transactionUpdate: (transactions: (FILTransaction|FILTransactionProcessing)[]) => void,
  balanceUpdate: (balance:string) => void
}

export interface WalletSeed {
  seed: string;
  isNew: boolean;
}
