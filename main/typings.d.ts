export interface Context {
  showUI: () => void
  loadWebUIFromDist: import('electron-serve').loadURL
}
