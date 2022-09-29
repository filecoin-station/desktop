export async function confirmChangeWalletAddress (): Promise<boolean> {
  return await window.electron.dialogs.confirmChangeWalletAddress()
}
