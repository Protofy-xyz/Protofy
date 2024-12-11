const fs = require('fs')

const content = 'TOKEN_SECRET='+require('crypto').randomBytes(64).toString('hex')+"\n"
if(!fs.existsSync('./../../.env')) {
    fs.writeFileSync('./../../.env', content)
} else {
    const fileContent = fs.readFileSync('./../../.env').toString()
    if(!fileContent.includes('TOKEN_SECRET')) {
        fs.appendFileSync('./../../.env', content)
    }
}

if (!fs.existsSync('./../next-compiled/.next')) {
    //run yarn package
    const { exec } = require('child_process');
    console.log("Compiling core...")
    exec('yarn package', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}
