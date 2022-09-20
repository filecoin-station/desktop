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

export type ModuleJobCount = Record<string, number>;

export interface Context {
  recordActivity(activity: RecordActivityArgs): void;
  getAllActivities(): Activity[];

  setModuleJobCount(moduleName: string, count: number): void;
  getTotalJobCount(): number;

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void
}
