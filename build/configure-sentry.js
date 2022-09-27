// This is called by GitHub Actions workflow to determine the build version to report to Sentry

'use strict'

const { getGitHubBuildMetadata } = require('./before-pack')
const { getBuildVersion } = require('../main/build-version')
const packageJson = require('../package.json')

const { buildNumber, buildTag } = getGitHubBuildMetadata()
const { version } = packageJson

const buildVersion = getBuildVersion({ version, buildNumber, buildTag })
console.log('SENTRY_VERSION=%s', buildVersion)
console.log('SENTRY_ENV=%s', buildTag ? 'production' : 'development')
