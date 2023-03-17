import { FILTransaction, FILTransactionProcessing, FILTransactionStatus } from '../shared/typings'

export type ActivitySource = 'Station' | 'Saturn'
export type ActivityType = 'info' | 'error'

export type { FILTransaction, FILTransactionStatus, FILTransactionProcessing }

export interface Activity {
  id: string;
  timestamp: number;
  type: ActivityType;
  source: ActivitySource;
  message: string;
}

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
  };
}

export type RecordActivityArgs = Omit<Activity, 'id' | 'timestamp'>

export type ModuleJobStatsMap = Record<string, number>

export interface Context {
  recordActivity(activity: RecordActivityArgs): void;
  getAllActivities(): Activity[];

  setModuleJobsCompleted(moduleName: string, count: number): void;
  getTotalJobsCompleted(): number;

  showUI: () => void;
  loadWebUIFromDist: import('electron-serve').loadURL;
  manualCheckForUpdates: () => void;
  saveSaturnModuleLogAs: () => Promise<void>;
  confirmChangeWalletAddress: () => boolean;

  openReleaseNotes: () => void;
  restartToUpdate: () => void;
  getUpdaterStatus: () => {updateAvailable: boolean};
  browseTransactionTracker: (transactionHash: string) => void;

  transactionUpdate: (transactions: (FILTransaction|FILTransactionProcessing)[]) => void;
  balanceUpdate: (balance:string) => void;
}

export interface WalletSeed {
  seed: string;
  isNew: boolean;
}
