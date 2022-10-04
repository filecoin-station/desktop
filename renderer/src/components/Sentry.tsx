import { useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

const SentryComponent = () => {
  useEffect(() => {
    // Disable Sentry integration for dev builds
    if (window.electron.stationBuildVersion.endsWith('-dev')) { return }

    Sentry.init({
      dsn: 'https://ff9615d8516545158e186d863a06a0f1@o1408530.ingest.sentry.io/6762462',
      integrations: [new BrowserTracing()],
      release: window.electron.stationBuildVersion,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.1
    })
  }, [])

  return null
}

export default SentryComponent
