import { FILTransaction, FILTransactionProcessing } from '../shared/typings'
import { ActivityEvent } from '@filecoin-station/core'
export type { FILTransactionStatus } from '../shared/typings'
export type { FILTransaction, FILTransactionProcessing }

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
  recordActivity(activity: ActivityEvent): void;
  getAllActivities(): Promise<ActivityEvent[]>;

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
