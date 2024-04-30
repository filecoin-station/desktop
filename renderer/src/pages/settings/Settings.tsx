import { useEffect, useState } from 'react'
import {
  checkForUpdates,
  exportSeedPhrase,
  isOpenAtLogin,
  saveModuleLogsAs,
  toggleOpenAtLogin
} from 'src/lib/station-config'

const Settings = () => {
  const [isOpenAtLoginChecked, setIsOpenAtLoginChecked] = useState(true)

  const updateIsOpenAtLogin = async () => setIsOpenAtLoginChecked(await isOpenAtLogin())

  async function handleClick () {
    toggleOpenAtLogin()
    updateIsOpenAtLogin()
  }

  useEffect(() => {
    updateIsOpenAtLogin()
  }, [])

  return (
    <div className="px-20">
      <h1 className="font-bold mb-6">Settings</h1>
      <h2>General</h2>
      <div className="flex flex-col items-start mb-6">
        <label>
          <input type="checkbox" onChange={handleClick} checked={isOpenAtLoginChecked} />
            Start at login
        </label>
        <button type="button" onClick={checkForUpdates}>Check for updates</button>
        <button type="button" onClick={saveModuleLogsAs}>Save module logs as...</button>
      </div>
      <h2>Security</h2>
      <button type="button" onClick={exportSeedPhrase}>Export seed phrase</button>
    </div>
  )
}

export default Settings
