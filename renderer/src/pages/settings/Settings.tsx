const Settings = () => {
  return (
    <div className="px-20">
      <h1 className="font-bold mb-6">Settings</h1>
      <h2>General</h2>
      <div className="flex flex-col items-start mb-6">
        <label>
          <input type="checkbox" name="startAtLogin"/>
            Start at login
        </label>
        <button type="button">Check for updates</button>
        <button type="button">Save module logs as...</button>
      </div>
      <h2>Security</h2>
      <button type="button">Export seed phrase</button>
    </div>
  )
}

export default Settings
