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

export type ModuleJobStatsMap = Record<string, number>;

export interface Context {
  recordActivity(activity: RecordActivityArgs): void;
  getAllActivities(): Activity[];

  setModuleJobsCompleted(moduleName: string, count: number): void;
  getTotalJobsCompleted(): number;

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void
}
