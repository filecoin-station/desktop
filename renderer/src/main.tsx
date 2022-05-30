import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
