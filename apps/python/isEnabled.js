const system = require('../../system.js')
const python = system.services.find((s => s.name === 'python'))
if(python.disabled) {
    //exit with code 1
    console.log('Skipping python setup due to disabled service')
    process.exit(1)
} else {
    //exit with code 0
    process.exit(0)
}