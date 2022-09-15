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

const activities: Activity[] = []

window.electron.onActivityLogged(activity => {
  activities.push(activity)
  activities.sort((a, b) => {
    return a.timestamp !== b.timestamp
      ? b.timestamp - a.timestamp
      : a.id.localeCompare(b.id)
  })
  if (activities.length > 100) activities.shift()

  console.log('[ACTIVITY] %j', activity)
  console.log('[ACTIVITIES]', activities)
})

window.electron.resumeActivityStream().then(() => {
  console.log('ACTIVITY STREAM RESUMED')
})
