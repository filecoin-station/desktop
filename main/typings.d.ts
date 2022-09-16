export type ActivitySource = 'Station' | 'Saturn';
export type ActivityType = 'info' | 'error';

export interface Activity {
  id: string;
  timestamp: number;
  type: ActivityType;
  source: ActivitySource;
  message: string;
}

export type RecordActivityArgs = Omit<Activity, 'id' | 'timestamp'>;

export interface Context {
  recordActivity(activity: RecordActivityArgs): void;
  getAllActivities(): void;

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void
}
