import { Activity, FILTransaction, FILTransactionProcessing } from '../../shared/typings'
export type { FILTransactionStatus } from '../../shared/typings'
export type { Activity, FILTransaction, FILTransactionProcessing }

declare global {
  interface Window {
    electron: {
      stationBuildVersion: string;

      onJobStatsUpdated (callback: (totalJobCount: number) => void): () => void;
      getUpdaterStatus(): Promise<{updateAvailable: boolean}>;
      openReleaseNotes(): void;
      restartToUpdate(): void;

      stationConfig: {
        getOnboardingCompleted: () => Promise<boolean>;
        setOnboardingCompleted: () => Promise<void>;
        getStationWalletAddress: () => Promise<string>;
        getDestinationWalletAddress: () => Promise<string | undefined>;
        setDestinationWalletAddress: (address: string | undefined) => Promise<void>;
        getStationWalletBalance: () => Promise<string>;
        getStationWalletTransactionsHistory: () => Promise<(FILTransaction|FILTransactionProcessing)[]>;
        transferAllFundsToDestinationWallet: () => Promise<void>;
        browseTransactionTracker: (transactionHash: string) => void;
      };
      stationEvents: {
        onActivityLogged: (callback: (activity: Activity) => void) => () => void;
        onJobProcessed: (callback: (value: number) => void) => () => void;
        onEarningsChanged: (callback: (value: number) => void) => () => void;
        onUpdateAvailable: (callback: () => void) => () => void;
        onTransactionUpdate:
          (callback: (allTransactions: (FILTransaction|FILTransactionProcessing)[]) => void) => () => void;
        onBalanceUpdate: (callback: (balance: string) => void) => () => void;
      };
      dialogs: {
        confirmChangeWalletAddress: () => Promise<boolean>;
      };
    };
  }
}

export function isFILTransactionProcessing (
  tx: FILTransaction | FILTransactionProcessing
): tx is FILTransactionProcessing {
  return tx.status === 'processing'
}

export function isFILTransactionConfirmed (tx: FILTransaction | FILTransactionProcessing): tx is FILTransaction {
  return tx.status !== 'processing'
}
