export async function getStationFilAddress (): Promise<string | undefined> {
  return await window.electron.stationConfig.getFilAddress()
}

export async function setStationFilAddress (address: string | undefined): Promise<void> {
  return await window.electron.stationConfig.setFilAddress(address)
}

export async function getStationUserSawOnboarding (): Promise<boolean> {
  return await window.electron.stationConfig.getSawOnboarding()
}

export async function setStationUserSawOnboarding (): Promise<void> {
  return await window.electron.stationConfig.setSawOnboarding()
}

export async function getStationUserConsent (): Promise<boolean> {
  return await window.electron.stationConfig.getUserConsent()
}

export async function setStationUserConsent (consent: boolean): Promise<void> {
  return await window.electron.stationConfig.setUserConsent(consent)
}

export async function isSaturnNodeRunning (): Promise<boolean> {
  return await window.electron.saturnNode.isRunning()
}

export async function getSaturnNodeWebUrl (): Promise<string> {
  return await window.electron.saturnNode.getWebUrl()
}

export async function getSaturnNodeLog (): Promise<string> {
  return await window.electron.saturnNode.getLog()
}

export async function getSaturnNodeFilAddress (): Promise<string | undefined> {
  return await window.electron.saturnNode.getFilAddress()
}

export async function setSaturnNodeFilAddress (address: string | undefined): Promise<void> {
  return await window.electron.saturnNode.setFilAddress(address)
}

export async function stopSaturnNode (): Promise<void> {
  return await window.electron.saturnNode.stop()
}

export async function startSaturnNode (): Promise<void> {
  return await window.electron.saturnNode.start()
}
