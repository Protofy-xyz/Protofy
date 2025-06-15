const services = require('./services.js')
const nextra = services.find((s => s.name === 'nextra'))
if(nextra.disabled) {
    //exit with code 1
    console.log('Skipping nextra documentation build due to disabled service')
    process.exit(1)
} else {
    //exit with code 0
    process.exit(0)
}