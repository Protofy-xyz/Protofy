const fs = require('fs')
const { execSync } = require('child_process');
const semver = require('semver');
const requiredVersion = '>=18.0.0';

if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(`Protofy requires node version: ${requiredVersion}. Current version ${process.version}.`);
    console.error('If you need help, join our discord: https://discord.gg/VpeZxMFfYW')
    process.exit(1);
  }

const isLatest = process.argv.length > 2 && process.argv[2] == '--latest'

const modules = JSON.parse(fs.readFileSync('./modules.json').toString())
// console.log('modules', modules)

function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

const storeLibVersion = (moduleDir, moduleName) => {
    //console.log('store lib version executed for: ', moduleDir, moduleName)
    const currentRevision = exec('cd '+moduleDir+' && git rev-parse HEAD')
    if(modules[moduleName].revision !== currentRevision) {
        console.log('Updating revision for library '+moduleName+'. Setting revision to: '+currentRevision)
        modules[moduleName].revision = currentRevision
        fs.writeFileSync('./modules.json', JSON.stringify(modules, null, 4))
    }

}

const exec = (cmd) => {
    //console.log('[*] Executing: ', cmd)
    return execSync(cmd).toString().trim()
}

if(!fs.existsSync("./data")) {
    fs.mkdirSync('./data')
}

if(!fs.existsSync("./data/databases")) {
    fs.mkdirSync('./data/databases')
}

Object.keys(modules).forEach((moduleName) => {
    //console.log('Preparing', moduleName, '...')
    const moduleDir = "packages/"+moduleName
    if(!fs.existsSync(moduleDir) || isEmpty(moduleDir) ) {
        console.log(moduleName+ ' not found, cloning into', moduleDir)
        exec('git clone '+modules[moduleName].url+' '+moduleDir)
    } 

    if(!isLatest) {
        exec('cd '+moduleDir+' && git checkout '+modules[moduleName].revision)
    } else {
        console.log('[*] Warning: --latest flag was specified. Using the latest version of', moduleName)
        exec('cd '+moduleDir+' && git checkout main')
    }

    storeLibVersion(moduleDir, moduleName)
})