import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './Saturn.css'

export default function Saturn (): JSX.Element {
  const [isRunning, setIsRunning] = useState(true)
  const [saturnNodeWebUrl, setSaturnNodeWebUrl] = useState('')
  const [saturnNodeLog, setSaturnNodeLog] = useState('')

  const updateStatus = (): void => {
    isSaturnNodeRunning().then(setIsRunning)
    getSaturnNodeWebUrl().then(setSaturnNodeWebUrl)
    getSaturnNodeLog().then(setSaturnNodeLog)
    // `useEffect` and `setInterval` do not support async functions.
    // We are running the update in background and not waiting for the promises to resolve.
  }

  useEffect(() => {
    updateStatus()
    const id = setInterval(updateStatus, 1000)

    return () => clearInterval(id)
  }, [])

  async function onRestartClick (): Promise<void> {
    await window.electron.startSaturnNode()
    updateStatus()
  }

  const content = isRunning && saturnNodeWebUrl
    ? ModuleFrame({ saturnNodeWebUrl })
    : ErrorNotRunning({ onRestartClick, saturnNodeLog })

  return (
    <div>
      {content}
      <p><Link to='/'>Station &gt;&gt;</Link></p>
    </div>
  )
}

async function isSaturnNodeRunning (): Promise<boolean> {
  return await window.electron.isSaturnNodeRunning()
}

async function getSaturnNodeWebUrl () : Promise<string> {
  return await window.electron.getSaturnNodeWebUrl()
}

async function getSaturnNodeLog () : Promise<string> {
  return await window.electron.getSaturnNodeLog()
}

function ErrorNotRunning ({ onRestartClick, saturnNodeLog } : {onRestartClick: React.MouseEventHandler<HTMLButtonElement>, saturnNodeLog: string}) {
  const buttonStyle = {
    justifyContent: 'center',
    height: '100%',
    borderRadius: '1em',
    fontSize: '1rem',
    padding: '1em',
    margin: '1em',
    border: 'none',
    background: '#c2b280'
  }

  return (
    <div style={{ padding: '1em' }}>
      <div className='logo'>🪐</div>
      <p style={{ color: 'red' }}>ERROR: Saturn node not running.</p>
      <pre className='log'><code>{saturnNodeLog}</code></pre>
      <div><button onClick={onRestartClick} style={buttonStyle}>Restart the node</button></div>
    </div>
  )
}

function ModuleFrame ({ saturnNodeWebUrl }: { saturnNodeWebUrl: string}) {
  const iframeStyle : React.CSSProperties = {
    width: '90vw',
    height: 'calc(90vh - 8rem)',
    border: '1px solid #c2b280'
  }
  return (
    <iframe id='module-webui' src={saturnNodeWebUrl} title='Saturn Node' style={iframeStyle}/>
  )
}
