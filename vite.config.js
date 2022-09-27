'use strict'

import svgr from 'vite-plugin-svgr'

const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react').default
const path = require('node:path')

const rendererDir = path.resolve(__dirname, 'renderer')

// https://vitejs.dev/config/
export default defineConfig({
  root: rendererDir,
  plugins: [svgr(), react()],
  base: './',
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'chrome100'
  },
  test: {
    globals: true,
    threads: false,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
