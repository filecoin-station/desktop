export type ActivitySource = 'Station' | 'Saturn';
export type ActivityEventType = 'info' | 'error';

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type: ActivityEventType;
  source: ActivitySource;
  message: string;
}

export interface Context {
  recordActivity(event: ActivityEvent): void;
  resumeActivityStream(): void;

  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
  manualCheckForUpdates: () => void
}
