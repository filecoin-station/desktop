'use strict'

// NOTE(bajtos) app-builder-lib does not export BeforePackContext.
// Both BeforePackContext and AfterPackContext are defined as a type alias for PackContext
/** @typedef {import('app-builder-lib').AfterPackContext} BeforePackContext */

/**
 * @param {BeforePackContext} context
 */
exports.default = async function ({ packager }) {
  const extraMetadata = packager.config.extraMetadata
  extraMetadata.buildTag = process.env.CI_BUILD_TAG
  if (process.env.GITHUB_RUN_NUMBER) {
    extraMetadata.buildNumber = process.env.GITHUB_RUN_NUMBER
  }

  console.log('APP INFO', packager.appInfo)
  console.log('CONFIG', packager.config)
}
