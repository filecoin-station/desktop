export async function getFilAddress (): Promise<string | undefined> {
  return await window.electron.stationConfig.getFilAddress()
}

export async function setFilAddress (address: string | undefined): Promise<void> {
  return await window.electron.stationConfig.setFilAddress(address)
}
