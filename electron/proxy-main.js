const path = require('path')
const fs = require('fs')
const Module = require('module')
const { app } = require('electron') 

const projectDir = 'project'

let MONOREPO_ROOT
if(process.platform === 'darwin') {

  const dest = path.join(app.getPath('userData'), 'app-runtime-0.1.0')
  MONOREPO_ROOT = path.join(dest, 'electron')
  if(!fs.existsSync(dest)) {
    fs.cpSync(path.join(__dirname, '..'), dest, {recursive: true})
  }
} else {
  MONOREPO_ROOT = path.resolve(__dirname, '../../../', projectDir, 'electron')
}

console.log(`📂 Monorepo root: ${MONOREPO_ROOT}`)

let ENTRYPOINT = path.join(MONOREPO_ROOT, 'main.js')

console.log('🔍 Looking for entrypoint in: ', ENTRYPOINT)

if (!fs.existsSync(ENTRYPOINT)) {
  ENTRYPOINT = path.resolve(__dirname, 'main.js')
  if (!fs.existsSync(ENTRYPOINT)) {
    console.error(`❌ Entrypoint not found on ${ENTRYPOINT}`)
    process.exit(1)
  }
  global.skipInstall = true // Skip install step in the main process
}

const customRequire = Module.createRequire(ENTRYPOINT)

console.log(`🚀 Running ${ENTRYPOINT}`)
customRequire(ENTRYPOINT)