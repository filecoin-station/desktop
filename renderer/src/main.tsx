import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Activity } from '../../main/typings'
import App from './App'
import './index.css'

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
  // In case two activities were recorded in the same millisecond, fall back to
  // sorting by their IDs, which are guaranteed to be unique and therefore
  // provide a stable sorting.
  activities.sort((a, b) => {
    return a.timestamp !== b.timestamp
      ? b.timestamp - a.timestamp
      : a.id.localeCompare(b.id)
  })
  if (activities.length > 100) activities.shift()

  console.log('[ACTIVITY] %j', activity)
  console.log('[ACTIVITIES]', activities)
})

window.electron.startActivityStream().then(() => {
  console.log('ACTIVITY STREAM RESUMED')
})
