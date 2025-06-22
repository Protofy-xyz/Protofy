//this is a proxy to call the real main.js
const path = require('path')
const fs = require('fs')
const Module = require('module')
const minimist = require('minimist');
const args = minimist(process.argv.slice(1));
const projectDir = args.project || 'project';

const MONOREPO_ROOT = path.resolve(__dirname, '../../'+projectDir)
let ENTRYPOINT = path.join(MONOREPO_ROOT, 'main.js')
let NODE_MODULES_PATH = path.join(MONOREPO_ROOT, 'node_modules')

if (!fs.existsSync(ENTRYPOINT)) { //if the entrypoint is not found in the project root, try to find it in the current directory
  ENTRYPOINT = path.resolve(__dirname, path.join('./', 'main.js'))
  NODE_MODULES_PATH = path.resolve(__dirname, path.join('./', 'node_modules'))
  if (!fs.existsSync(ENTRYPOINT)) {
    console.error(`❌ Entrypoint not found on ${ENTRYPOINT}`)
    process.exit(1)
  }
}

if (!fs.existsSync(NODE_MODULES_PATH)) {
  console.error(`❌ Missing node_modules on ${NODE_MODULES_PATH}`)
  process.exit(1)
}

const customRequire = Module.createRequire(ENTRYPOINT)

// Arrancamos la app real
console.log(`🚀 Running ${ENTRYPOINT}`)
customRequire(ENTRYPOINT)