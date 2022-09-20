export async function getStationUserOnboardingCompleted (): Promise<boolean> {
  return await window.electron.stationConfig.getOnboardingCompleted()
}

export async function setStationUserOnboardingCompleted (): Promise<void> {
  return await window.electron.stationConfig.setOnboardingCompleted()
}
