const system = require('../../system.js')
const next = system.services.find((s => s.name === 'next'))
if(next.disabled) {
    //exit with code 1
    console.log('Skipping next.js build due to disabled service')
    process.exit(1)
} else {
    //exit with code 0
    process.exit(0)
}