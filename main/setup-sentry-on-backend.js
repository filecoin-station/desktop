'use strict'

const Sentry = require('@sentry/node')
const { BUILD_VERSION } = require('./consts')

// Disable Sentry integration for dev builds
if (!BUILD_VERSION.endsWith('-dev')) {
  // Importing @sentry/tracing patches the global hub for tracing to work.
  require('@sentry/tracing')

  Sentry.init({
    dsn: 'https://ff9615d8516545158e186d863a06a0f1@o1408530.ingest.sentry.io/6762462',
    release: BUILD_VERSION,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1
  })
}
