import './index.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Buffer from 'buffer/'

window.Buffer = Buffer

ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
