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
}

// helper
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// FILTransaction with certain properties changed to optional
export type FILTransactionProcessing = PartialBy<FILTransaction, 'hash' | 'height'>;
export type FILTransactionLoading = PartialBy<FILTransaction, 'status' | 'timestamp'>;

export interface GQLMessage {
  cid: string;
  to: {
    robust: string;
  }
  from: {
    robust: string;
  }
  nonce: number;
  height: number;
  method: string;
  params: string;
  value: string;
  timestamp: number?;
  exitCode: number?;
}

export interface GQLTipset {
  minHeight: number;
}

export interface GQLStateReplay {
  receipt: {
    return: string;
    exitCode: number;
    gasUsed: number;
  }
  executionTrace: {
    executionTrace: string;
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
