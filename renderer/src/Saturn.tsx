import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FilAddressForm from './components/FilAddressForm'

import './Saturn.css'

export default function Saturn (): JSX.Element {
  const [isRunning, setIsRunning] = useState(true)
  const [saturnNodeWebUrl, setSaturnNodeWebUrl] = useState('')
  const [saturnNodeLog, setSaturnNodeLog] = useState('')
  const [filAddress, setFilAddress] = useState<string | undefined>()

  const updateStatus = (): void => {
    isSaturnNodeRunning().then(setIsRunning)
    getSaturnNodeWebUrl().then(setSaturnNodeWebUrl)
    getSaturnNodeLog().then(setSaturnNodeLog)
    getSaturnNodeFilAddress().then(setFilAddress)
    // `useEffect` and `setInterval` do not support async functions.
    // We are running the update in background and not waiting for the promises to resolve.
  }

  useEffect(() => { document.title = 'Saturn' })

  useEffect(() => {
    updateStatus()
    const id = setInterval(updateStatus, 1000)

    return () => clearInterval(id)
  }, [])

  async function onRestartClick (): Promise<void> {
    if (!filAddress) return
    await window.electron.saturnNode.start()
    updateStatus()
  }

  async function onFilAddressChanged (address: string) : Promise<void> {
    setFilAddress(address)
    await setSaturnNodeFilAddress(address)
    if (await isSaturnNodeRunning()) {
      await window.electron.saturnNode.stop()
    }
    if (!address) return
    await window.electron.saturnNode.start()
    updateStatus()
  }

  const content = isRunning
    ? saturnNodeWebUrl
      ? ModuleFrame({ saturnNodeWebUrl })
      : ErrorNotRunning({ onRestartClick, saturnNodeLog })
    : filAddress
      ? ErrorNotRunning({ onRestartClick, saturnNodeLog })
      : <p>Please provide the FIL wallet address to use for Saturn Node</p>

  return (
    <div>
      <div className='wallet'>
        <label>FIL wallet address:</label>
        <FilAddressForm address={filAddress} setAddress={setFilAddress} onValidAddress={onFilAddressChanged } />
      </div>
      {content}
      <p><Link to='/'>Station &gt;&gt;</Link></p>
    </div>
  )
}

async function isSaturnNodeRunning (): Promise<boolean> {
  return await window.electron.saturnNode.isRunning()
}

async function getSaturnNodeWebUrl () : Promise<string> {
  return await window.electron.saturnNode.getWebUrl()
}

async function getSaturnNodeLog () : Promise<string> {
  return await window.electron.saturnNode.getLog()
}

async function getSaturnNodeFilAddress (): Promise<string | undefined> {
  return await window.electron.saturnNode.getFilAddress()
}

async function setSaturnNodeFilAddress (address: string | undefined): Promise<void> {
  return await window.electron.saturnNode.setFilAddress(address)
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
