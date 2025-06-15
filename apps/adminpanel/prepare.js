const fs = require('fs')
const path = require('path')


const fast = process.argv[2] === '--fast'

if (!fs.existsSync('../../data/pages/workspace/index.html')) {
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