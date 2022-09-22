import './index.css'

import * as Sentry from '@sentry/react'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import ReactDOM from 'react-dom/client'

Sentry.init({
  dsn: 'https://ff9615d8516545158e186d863a06a0f1@o1408530.ingest.sentry.io/6762462',
  integrations: [new BrowserTracing()],

  release: window.electron.stationBuildVersion,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1
})

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
