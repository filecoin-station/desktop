import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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

window.electron.getActivityLog().then(log => {
  console.log('GOT INITIAL ACTIVITY LOG')
  log.forEach(entry => console.log('[ACTIVITY] %j', entry))
})

window.electron.onActivityLogged(entry => {
  console.log('[ACTIVITY] %j', entry)
})
