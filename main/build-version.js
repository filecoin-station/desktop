// This code is shared between Electron main (backend) and GitHub Actions workflow
// We can use vanilla Node.js APIs only. In particular, we CANNOT use `require('electron)`

'use strict'

/**
 * @param {object} args
 * @param {string} args.version Semantic version number from package.json, e.g. `0.5.0`
 * @param {string | null} [args.buildTag] Git tag used to build this version.  `undefined` for
 *   non-release builds.
 * @param {string | null} [args.buildNumber] CI build number of the workflow run that created this version.
 * @returns {string} A build version in one of the following formats:
 *  - `x.y.z` for release builds, e.g. `0.5.0`.
 *  - `x.y.z.N` for CI builds, where N is the build number, e.g. `0.5.0.4238`.
 *  - `x.y.z.1-dev` in all other cases (typically a local dev build), e.g. `0.5.0.1-dev`.
 */
function getBuildVersion ({ version, buildTag, buildNumber }) {
  // A release build produced by GitHub Actions CI
  if (buildTag === `v${version}`) return version

  // A non-release build produced by GitHub Actions CI
  if (buildNumber) return `${version}.${buildNumber}`

  // A local build.
  // TODO: can we use Git commit SHA?
  return `${version}.1-dev`
}

module.exports = {
  getBuildVersion
}
