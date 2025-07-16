const fs = require('fs')
const path = require('path')

if(!fs.existsSync('public')) {
    fs.mkdirSync('public')
    //copy from ../../data/public
    const publicPath = path.resolve(__dirname, '../../data/public')
    fs.cpSync(publicPath, 'public', { recursive: true, force: true })
    console.log("Copied public files from data directory")
}

if (!fs.existsSync('../../electron/launcher')) {
    //run yarn package
    const { exec } = require('child_process');
    console.log("Compiling launcher app...")
    exec('yarn package', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}