import { Activity, FILTransaction, FILTransactionProcessing } from '../shared/typings'
export type { ActivitySource, ActivityType, FILTransactionStatus } from '../shared/typings'
export type { Activity, FILTransaction, FILTransactionProcessing }

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

export interface Context {
  recordActivity(activity: Activity): void;
  getAllActivities(): Promise<Activity[]>;

  setTotalJobsCompleted(count: number): void;
  getTotalJobsCompleted(): Promise<number>;

  showUI: () => void;
  loadWebUIFromDist: import('electron-serve').loadURL;
  manualCheckForUpdates: () => void;
  saveModuleLogsAs: () => Promise<void>;
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

interface CoreEventJobsCompleted {
  type: 'jobs-completed';
  total: number;
}

interface CoreEventActivityInfo {
  type: 'activity:info';
  message: string;
  module: string;
  timestamp: string;
  id: string;
}

interface CoreEventActivityError {
  type: 'activity:error';
  message: string;
  module: string;
  timestamp: string;
  id: string;
}

export type CoreEvent = CoreEventJobsCompleted | CoreEventActivityInfo | CoreEventActivityError
