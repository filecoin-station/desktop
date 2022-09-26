export async function getOnboardingCompleted (): Promise<boolean> {
  return await window.electron.stationConfig.getOnboardingCompleted()
}

export async function setOnboardingCompleted (): Promise<void> {
  return await window.electron.stationConfig.setOnboardingCompleted()
}

export async function getFilAddress (): Promise<string | undefined> {
  return await window.electron.stationConfig.getFilAddress()
}

export async function setFilAddress (address: string | undefined): Promise<void> {
  return await window.electron.stationConfig.setFilAddress(address)
}
