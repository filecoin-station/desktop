import { Activity, FILTransaction, FILTransactionProcessing } from '../shared/typings'
export type { FILTransactionStatus } from '../shared/typings'
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
  getActivities(): Activity[];
  setTotalJobsCompleted(count: number): void;
  getTotalJobsCompleted(): number;
  setScheduledRewardsForAddress(balance: string): void;
  getScheduledRewardsForAddress(): string;

  getScheduledRewards(): string;
  getWalletBalance(): string;

  showUI: () => void;
  isShowingUI: boolean;
  loadWebUIFromDist: import('electron-serve').loadURL;
  manualCheckForUpdates: () => void;
  saveModuleLogsAs: () => Promise<void>;
  confirmChangeWalletAddress: () => boolean;

  openReleaseNotes: () => void;
  restartToUpdate: () => void;
  getUpdaterStatus: () => {updateAvailable: boolean};
  browseTransactionTracker: (transactionHash: string) => void;
  showTermsOfService: () => void;

  transactionUpdate: (transactions: (FILTransaction|FILTransactionProcessing)[]) => void;
  balanceUpdate: (balance:string) => void;
}

export interface WalletSeed {
  seed: string;
  isNew: boolean;
}
