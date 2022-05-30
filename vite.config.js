const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react').default
const path = require('node:path')

const rendererDir = path.resolve(__dirname, 'renderer')

// https://vitejs.dev/config/
export default defineConfig({
  root: rendererDir,
  plugins: [react()],
  base: './',
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'chrome100'
  }
})
