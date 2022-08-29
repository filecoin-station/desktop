import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isSaturnNodeRunning, getSaturnNodeWebUrl, getSaturnNodeLog, stopSaturnNode, setStationFilAddress, startSaturnNode, getStationFilAddress } from '../components/InterfaceCalls'

import './../Saturn.css'

export default function Dashboard (): JSX.Element {
  const [isRunning, setIsRunning] = useState(true)
  const [saturnNodeWebUrl, setSaturnNodeWebUrl] = useState('')
  const [saturnNodeLog, setSaturnNodeLog] = useState('')
  const [filAddress, setFilAddress] = useState<string | undefined>()

  const updateStatus = (): void => {
    isSaturnNodeRunning().then(setIsRunning)
    getSaturnNodeWebUrl().then(setSaturnNodeWebUrl)
    getSaturnNodeLog().then(setSaturnNodeLog)
    getStationFilAddress().then(setFilAddress)
    // `useEffect` and `setInterval` do not support async functions.
    // We are running the update in background and not waiting for the promises to resolve.
  }

  useEffect(() => { document.title = 'Saturn' })

  useEffect(() => {
    updateStatus()
    if (filAddress) {
      startSaturnNode()
    }
    const id = setInterval(updateStatus, 1000)

    return () => clearInterval(id)
  }, [filAddress])

  async function onRestartClick (): Promise<void> {
    if (!filAddress) return
    await window.electron.saturnNode.start()
    updateStatus()
  }

  const disconnect = () => {
    stopSaturnNode().then(() => { 
      setStationFilAddress('').then(() => { setFilAddress(''); })
    })
  }

  const content = isRunning
    ? saturnNodeWebUrl
      ? ModuleFrame({ saturnNodeWebUrl, disconnect })
      : ErrorNotRunning({ onRestartClick, saturnNodeLog })
    : filAddress
      ? ErrorNotRunning({ onRestartClick, saturnNodeLog })
      : <Navigate to="/address" replace />
  
    
  return (
    <div className="h-full v-full">
      {content}
    </div>
  )
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
    <div>
      <p style={{ color: 'red' }}>ERROR: Saturn node not running.</p>
      <div className='logo'>🪐</div>
      <pre className='log'><code>{saturnNodeLog}</code></pre>
      <div><button onClick={onRestartClick} style={buttonStyle}>Restart the node</button></div>
    </div>
  )
}

function ModuleFrame ({ saturnNodeWebUrl, disconnect }: { saturnNodeWebUrl: string, disconnect: () => void}) {
  const iframeStyle : React.CSSProperties = {
    // width: '90vw',
    width: '100vw',
    height: '100vh'
  }
  return (
    <>
    <div className="fixed right-0">
    <button
      className="bg-gray-800 hover:bg-gray-900 text-neutral-50 py-2 px-4 inline-flex items-center disabled:bg-gray-400"
      onClick={() => { disconnect() }}>Disconnect</button>
    </div>
    <iframe id='module-webui' src={saturnNodeWebUrl} title='Saturn Node' style={iframeStyle}/>
    </>
  )
}
