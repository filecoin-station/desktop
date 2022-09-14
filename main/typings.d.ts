export type ActivitySource = 'Station' | 'Saturn';
export type ActivityType = 'info' | 'error';

export interface Activity {
  id: string;
  timestamp: number;
  type: ActivityType;
  source: ActivitySource;
  message: string;
}

export interface RecordActivityOptions {
  type: ActivityType;
  source: ActivitySource;
  message: string;
}

export interface Context {
  recordActivity(activity: RecordActivityOptions): void;
  resumeActivityStream(): void;

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void
}
