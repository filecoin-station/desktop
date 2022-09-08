export async function getStationFilAddress (): Promise<string | undefined> {
  return await window.electron.stationConfig.getFilAddress()
}

export async function setStationFilAddress (address: string | undefined): Promise<void> {
  return await window.electron.stationConfig.setFilAddress(address)
}

export async function getStationUserSawOnboarding(): Promise<boolean> {
  return await window.electron.stationConfig.getSawOnboarding()
}

export async function setStationUserSawOnboarding(): Promise<void> {
  return await window.electron.stationConfig.setSawOnboarding()
}

export async function getStationUserConsent(): Promise<boolean> {
  return await window.electron.stationConfig.getUserConsent()
}

export async function setStationUserConsent(consent: boolean): Promise<void> {
  return await window.electron.stationConfig.setUserConsent(consent)
}

export async function isSaturnNodeRunning(): Promise<boolean> {
  return await window.electron.saturnNode.isRunning()
}

export async function getSaturnNodeWebUrl(): Promise<string> {
  return await window.electron.saturnNode.getWebUrl()
}

export async function getSaturnNodeLog(): Promise<string> {
  return await window.electron.saturnNode.getLog()
}

export async function getSaturnNodeFilAddress(): Promise<string | undefined> {
  return await window.electron.saturnNode.getFilAddress()
}

export async function setSaturnNodeFilAddress(address: string | undefined): Promise<void> {
  return await window.electron.saturnNode.setFilAddress(address)
}

export async function stopSaturnNode(): Promise<void> {
  return await window.electron.saturnNode.stop()
}

export async function startSaturnNode(): Promise<void> {
  return await window.electron.saturnNode.start()
}

import { ActivityEventMessage } from '../typings'
export async function getStationActivityLog(): Promise<ActivityEventMessage[] | []> {
  return [{ time: (new Date("2022-09-08T01:01:30+00:00")).getTime(), msg: "A job just arrive", type: "info" },
  { time: (new Date("2022-04-01T01:01:30+00:00")).getTime(), msg: "Oopss", type: "warning" },
  { time: (new Date("2022-03-01T01:01:30+00:00")).getTime(), msg: "Job completed", type: "info" },
  { time: (new Date("2022-02-01T01:01:30+00:00")).getTime(), msg: "A job just arrive", type: "info" }]
}

export async function getStationTotalEarnings(): Promise<number | undefined> {
  return 3
}

export async function getStationTotalJobs(): Promise<number | undefined> {
  return 33
}