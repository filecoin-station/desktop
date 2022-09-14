import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Activity } from '../../main/typings'

ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

const events: Activity[] = []

window.electron.onActivityLogged(activity => {
  events.push(activity)
  if (events.length > 100) events.shift()

  console.log('[EVENTS]', events.sort((a, b) => {
    return a.timestamp !== b.timestamp
      ? b.timestamp - a.timestamp
      : a.id.localeCompare(b.id)
  }))
  console.log('[ACTIVITY] %j', activity)
})

window.electron.resumeActivityStream().then(() => {
  console.log('ACTIVITY STREAM RESUMED')
})
