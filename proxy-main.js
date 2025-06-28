//this is a proxy to call the real main.js
const path = require('path')
const fs = require('fs')
const projectDir = 'project';
const Module = require('module');

//check if osx
const MONOREPO_ROOT = path.resolve(process.platform === 'darwin' ? process.execPath + '../../../../' : __dirname+ '../../'+projectDir)
let ENTRYPOINT = path.join(MONOREPO_ROOT, 'main.js')

if (!fs.existsSync(ENTRYPOINT)) { //if the entrypoint is not found in the project root, try to find it in the current directory
  ENTRYPOINT = path.resolve(__dirname, path.join('./', 'main.js'))
  if (!fs.existsSync(ENTRYPOINT)) {
    console.error(`❌ Entrypoint not found on ${ENTRYPOINT}`)
    process.exit(1)
  }
}

const customRequire = Module.createRequire(ENTRYPOINT)

// Arrancamos la app real
console.log(`🚀 Running ${ENTRYPOINT}`)
customRequire(ENTRYPOINT)