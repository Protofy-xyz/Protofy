const fs = require('fs')
const path = require('path')


const fast = process.argv[2] === '--fast'

if (!fs.existsSync('./dist/apps/adminpanel/server.js')) {
    //run yarn package
    const { exec } = require('child_process');
    console.log("Compiling adminpanel app...")
    exec('yarn package', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

if(fs.existsSync('dist/')) {
    fs.copyFileSync('../../system.js', 'dist/system.js')
}