'use strict'

const Sentry = require('@sentry/node')
const { BUILD_VERSION } = require('./consts')

const isDevBuild = BUILD_VERSION.endsWith('-dev')

// Disable Sentry integration for dev builds
if (!isDevBuild) {
  Sentry.init({
    dsn: 'https://8667b1c7749ae24e35ba531bffa3ed7a@o1408530.ingest.us.sentry.io/6762462',
    release: BUILD_VERSION,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1
  })
}
