const fs = require('fs')
const semver = require('semver');
const requiredVersion = '>=18.0.0';

if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(`Protofy requires node version: ${requiredVersion}. Current version ${process.version}.`);
    console.error('If you need help, join our discord: https://discord.gg/VpeZxMFfYW')
    process.exit(1);
}

if (!fs.existsSync("./data")) {
    fs.mkdirSync('./data')
}

if (!fs.existsSync("./data/databases")) {
    fs.mkdirSync('./data/databases')
}