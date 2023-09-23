const fs = require('fs')
const { execSync } = require('child_process');
function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

if(!fs.existsSync("./data")) {
    fs.mkdirSync('./data')
}

if(!fs.existsSync("./data/databases")) {
    fs.mkdirSync('./data/databases')
}

if(!fs.existsSync("./packages/visualui") || isEmpty("./packages/visualui") ) {
    console.log('VisualUi not found, cloning into packages/visualui/ ...')
    execSync("git clone git@github.com:Protofy-xyz/protofy-visualui.git packages/visualui")
}

if(!fs.existsSync("./packages/protoflow") || isEmpty("./packages/protoflow")) {
    console.log('Protoflow not found, cloning into packages/protoflow/ ...')
    execSync("git clone git@github.com:Protofy-xyz/Protoflow.git packages/protoflow")
}

if(!fs.existsSync("./packages/protolib") || isEmpty("./packages/protolib")) {
    console.log('Protolib not found, cloning into packages/protolib/ ...')
    execSync("git clone git@github.com:Protofy-xyz/protolib.git packages/protolib")
}