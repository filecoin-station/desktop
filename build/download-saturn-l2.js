#!/usr/bin/env -S node

'use strict'

const SATURN_DIST_TAG = 'v0.4.2'

const { fetch } = require('undici')
const gunzip = require('gunzip-maybe')
const { mkdir, chmod } = require('node:fs/promises')
const { createWriteStream } = require('node:fs')
const path = require('node:path')
const { pipeline } = require('node:stream/promises')
const tar = require('tar-fs')
const unzip = require('unzip-stream')
const { once } = require('events')

/** @typedef {import('unzip-stream').Entry} UnzipStreamEntry */

const githubToken = process.env.GITHUB_TOKEN
const authorization = githubToken ? `Bearer ${githubToken}` : undefined

main().catch(err => {
  console.error('Unhandled error:', err)
  process.exit(1)
})

async function main () {
  console.log('Fetching release metadata for %s', SATURN_DIST_TAG)
  console.log('GitHub client:', authorization ? 'authorized' : 'anonymous')

  const { assets } = await fetchReleaseMetadata()

  const outDir = path.resolve(__dirname, 'saturn')
  await mkdir(outDir, { recursive: true })

  await Promise.all(
    assets
      .map(async ({ name, browser_download_url: url }) => {
        const match = name.match(/^L2-node_([A-Za-z0-9]+)_([A-Za-z0-9_]+)\.(tar\.gz|zip)$/)
        const platform = match && getPlatform(match[1])
        if (!match || platform !== process.platform) {
          console.log(' ⨯ skipping %s', name)
          return
        }

        const outName = `l2node-${platform}-${getArch(match[2])}`
        console.log(' ⇣ downloading %s', outName)
        const res = await fetch(url, {
          headers: {
            ...(authorization ? { authorization } : {})
          },
          redirect: 'follow'
        })

        if (res.status >= 300) {
          throw new Error(
            `Cannot fetch saturn-l2 binary ${name}: ${res.status}\n${await res.text()}`
          )
        }

        if (!res.body) {
          throw new Error(`Cannot fetch saturn-l2 binary ${name}: no response body`)
        }

        const outFile = path.join(outDir, outName)
        if (match[3] === 'tar.gz') {
          await pipeline(res.body, gunzip(), tar.extract(outDir))
        } else {
          // Darwin needs to be a zip for notarization
          await mkdir(path.join(outDir, 'l2node-darwin-x64'), { recursive: true })
          const parser = unzip.Parse()
          await Promise.all([
            (async () => {
              while (true) {
                const [entry] = /** @type {[UnzipStreamEntry]} */ (await once(parser, 'entry'))
                if (entry.path === 'L2-node') {
                  const outPath = `${outDir}/l2node-darwin-x64/saturn-L2-node`
                  await pipeline(entry, createWriteStream(outPath))
                  await chmod(outPath, 0o111)
                  return
                }
              }
            })(),
            pipeline(res.body, parser)
          ])
        }
        console.log(' ✓ %s', outFile)
      })
  )

  console.log('✨ DONE ✨')
}

/**
 * @returns {Promise<{
 *  assets: {name:string, browser_download_url: string}[];
 * }>}
 */
async function fetchReleaseMetadata () {
  const res = await fetch(
    `https://api.github.com/repos/filecoin-saturn/L2-node/releases/tags/${SATURN_DIST_TAG}`,
    {
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': 'undici',
        ...(authorization ? { authorization } : {})
      }
    }
  )
  if (res.status >= 300) {
    throw new Error(`Cannot fetch saturn-l2 release ${SATURN_DIST_TAG}: ${res.status}\n${await res.text()}`)
  }

  /** @type {any} */
  const data = await res.json()
  return data
}

/**
 * @param {string} golangOs
 */
function getPlatform (golangOs) {
  switch (golangOs) {
    case 'Windows': return 'win32'
    case 'Linux': return 'linux'
    case 'Darwin': return 'darwin'
  }
  throw new Error(`Unkown OS string: ${golangOs}`)
}

/**
 * @param {string} golangArch
 */
function getArch (golangArch) {
  switch (golangArch) {
    case 'x86_64':
      return 'x64'
    case 'i386':
      return 'ia32'
    case 'arm64':
      return 'arm64'
  }

  throw new Error(`Unkown ARCH string: ${golangArch}`)
}
