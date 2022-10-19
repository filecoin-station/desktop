'use strict'

// NOTE(bajtos) app-builder-lib does not export BeforePackContext.
// Both BeforePackContext and AfterPackContext are defined as a type alias for PackContext
/** @typedef {import('app-builder-lib').AfterPackContext} BeforePackContext */

/**
 * @param {BeforePackContext} context
 */
exports.default = async function ({ packager }) {
  // The config option `extraMetadata` allows us to write additional fields to
  // the packaged version of `package.json`.
  // Learn more in the docs:
  // https://www.electron.build/configuration/configuration.html#Configuration-extraMetadata
  Object.assign(packager.config.extraMetadata, getGitHubBuildMetadata())
}

function getGitHubBuildMetadata () {
  // Disable Sentry error reporting for packages produced from community-contributed pull requests.
  //
  // We are not able to create Sentry Release record for those PRs. As a result, we cannot map error
  // stack traces to original source code and associate errors with the development environment
  if (!process.env.SENTRY_AUTH_TOKEN) {
    return {
      buildTag: null,
      buildNumber: '1-dev'
    }
  }

  return {
    buildTag: process.env.GITHUB_REF_TYPE === 'tag' ? process.env.GITHUB_REF_NAME : null,
    buildNumber: process.env.GITHUB_RUN_NUMBER ?? '1-dev'
  }
}

exports.getGitHubBuildMetadata = getGitHubBuildMetadata
