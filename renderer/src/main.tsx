import './index.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Buffer from 'buffer/'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.Buffer = Buffer as any

ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
