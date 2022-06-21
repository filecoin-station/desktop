import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Switch from 'react-switch'

export default function Saturn (): JSX.Element {
  const [isRunning, setIsRunning] = useState(true)

  const updateStatus = (): void => {
    isSaturnNodeRunning().then(setIsRunning)
    // `useEffect` and `setInterval` do not support async functions.
    // We are running the update in background and not waiting for the promise to resolve.
  }

  useEffect(() => {
    updateStatus()
    const id = setInterval(updateStatus, 1000)

    return () => clearInterval(id)
  }, [])

  async function handleClick (): Promise<void> {
    await toggleSaturnNode(!isRunning)
    updateStatus()
  }

  const textStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    fontSize: 16
  }

  return (
    <div>
      <div className='logo'>🪐</div>
      <h2>Welcome to Saturn</h2>
      <p><Link to='/'>Station &gt;&gt;</Link></p>
      <label>
        <Switch
          id='status'
          onChange={handleClick}
          checked={isRunning}
          width={62}
          activeBoxShadow='0px 0px 1px 2px #fffc35'
          onColor='#15cd72'
          checkedIcon={
            <div style={textStyle}>On</div>
          }
          uncheckedIcon={
            <div style={textStyle}>Off</div>
          }
        />
      </label>
    </div>
  )
}

async function isSaturnNodeRunning (): Promise<boolean> {
  return await window.electron.isSaturnNodeRunning()
}

async function toggleSaturnNode (turnOn: boolean): Promise<void> {
  if (turnOn) {
    await window.electron.startSaturnNode()
  } else {
    await window.electron.stopSaturnNode()
  }
}
