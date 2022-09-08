export type ActivitySource = 'Station' | 'Saturn';
export type ActivityEventType = 'info' | 'error';

export interface ActivityEvent {
  type: ActivityEventType;
  source: ActivitySource;
  message: string;
}

export interface ActivityEntry extends ActivityEvent {
  id: string;
  timestamp: number;
}

export interface Context {
  recordActivity(event: ActivityEvent): void;
  getAllActivityLogEntries(): ActivityEntry[];

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void
}
