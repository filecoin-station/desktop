# Developer Guide

## Development workflow

Run `npm start` to open the Electron app and load the WebUI via the Vite DEV server. Changes made
inside `renderer` files will be immediately applied in the running app.

Run `npm lint` to check for coding style issues and type errors.

## CommonJS vs ES Modules

Electron does not support ESM for the backend code. We use CommonJS (`require`) in those files.

The front-end is written in TypeScript; there is no such limitation. Therefore inside `renderer`,
we use ESM to get better developer experience and tooling support.

## Updating to a new major version of Electron/Chromium

After updating to a newer Chromium version, update the compilation target for `renderer` files
in [vite.config.js](./../vite.config.js).
