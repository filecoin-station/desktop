import { ActivityEventMessage, FILTransaction } from '../typings'

export async function getOnboardingCompleted (): Promise<boolean> {
  return await window.electron.stationConfig.getOnboardingCompleted()
}

export async function setOnboardingCompleted (): Promise<void> {
  return await window.electron.stationConfig.setOnboardingCompleted()
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

export async function stopSaturnNode (): Promise<void> {
  return await window.electron.saturnNode.stop()
}

export async function startSaturnNode (): Promise<void> {
  return await window.electron.saturnNode.start()
}

export async function getAllActivities (): Promise<ActivityEventMessage[]> {
  return await window.electron.getAllActivities()
}

export async function getTotalEarnings (): Promise<number> {
  return 0
}

export async function getTotalJobsCompleted (): Promise<number> {
  return await window.electron.getTotalJobsCompleted()
}

export async function restartToUpdate (): Promise<void> {
  return await window.electron.restartToUpdate()
}

export function openReleaseNotes (): void {
  return window.electron.openReleaseNotes()
}

export async function getDestinationWalletAddress (): Promise<string | undefined> {
  return await window.electron.stationConfig.getDestinationWalletAddress()
}

export async function setDestinationWalletAddress (address: string | undefined): Promise<void> {
  return await window.electron.stationConfig.setDestinationWalletAddress(address)
}

export async function getStationWalletAddress (): Promise<string> {
  return await window.electron.stationConfig.getStationWalletAddress()
}

export async function getStationWalletBalance (): Promise<number> {
  return await window.electron.stationConfig.getStationWalletBalance()
}

export async function getStationWalletTransactionsHistory (): Promise<FILTransaction[]> {
  return await window.electron.stationConfig.getStationWalletTransactionsHistory()
}

export async function transferAllFundsToDestinationWallet (): Promise<void> {
  return await window.electron.stationConfig.transferAllFundsToDestinationWallet()
}

export function brownseTransactionTracker (transactionHash: string): void {
  return window.electron.stationConfig.browseTransactionTracker(transactionHash)
}
