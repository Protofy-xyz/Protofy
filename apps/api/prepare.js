const fs = require('fs')

if(!fs.existsSync('./dist/apps/api/src/index.js')) {
    //run yarn package
    const { exec } = require('child_process');
    console.log("Compiling api...")
    exec('yarn package', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}