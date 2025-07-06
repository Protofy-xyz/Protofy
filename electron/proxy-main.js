const path = require('path')
const fs = require('fs')
const Module = require('module')
const { app } = require('electron') 

const projectDir = 'project'

let MONOREPO_ROOT
if(process.platform === 'darwin') {

  const dest = path.join(app.getPath('userData'), 'app-runtime-0.0.12')
  MONOREPO_ROOT = dest
  if(!fs.existsSync(dest)) {
    fs.cpSync(path.join(__dirname, '..'), dest, {recursive: true})
  }
} else {
  MONOREPO_ROOT = path.resolve(__dirname, '../../../', projectDir)
}


let ENTRYPOINT = path.join(MONOREPO_ROOT, 'main.js')

if (!fs.existsSync(ENTRYPOINT)) {
  ENTRYPOINT = path.resolve(__dirname, 'main.js')
  if (!fs.existsSync(ENTRYPOINT)) {
    console.error(`❌ Entrypoint not found on ${ENTRYPOINT}`)
    process.exit(1)
  }
}

const customRequire = Module.createRequire(ENTRYPOINT)

console.log(`🚀 Running ${ENTRYPOINT}`)
customRequire(ENTRYPOINT)