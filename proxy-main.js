//this is a proxy to call the real main.js
const path = require('path')
const fs = require('fs')
const Module = require('module')
const MONOREPO_ROOT = path.resolve(__dirname, '../../project')
const ENTRYPOINT = path.join(MONOREPO_ROOT, 'main.js')
const NODE_MODULES_PATH = path.join(MONOREPO_ROOT, 'node_modules')

if (!fs.existsSync(ENTRYPOINT)) {
  console.error(`❌ Entrypoint not found on ${ENTRYPOINT}`)
  process.exit(1)
}

if (!fs.existsSync(NODE_MODULES_PATH)) {
  console.error(`❌ Missing node_modules on ${NODE_MODULES_PATH}`)
  process.exit(1)
}

const customRequire = Module.createRequire(ENTRYPOINT)

// Arrancamos la app real
console.log(`🚀 Running ${ENTRYPOINT}`)
customRequire(ENTRYPOINT)