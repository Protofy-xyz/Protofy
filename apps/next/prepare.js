const fs = require('fs')

const content = `IGNORE_TS_CONFIG_PATHS=true
TAMAGUI_TARGET=web
TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1
NEXT_PUBLIC_MAPBOX_TOKEN=PUT_HERE_YOUR_API_KEY
`

if(!fs.existsSync('./../../.env')) {
    fs.appendFileSync('./../../.env', content)
} else {
    const fileContent = fs.readFileSync('./../../.env').toString()
    if(!fileContent.includes('TAMAGUI_TARGET')) {
        fs.appendFileSync('./../../.env', content)
    }
}

if(!fs.existsSync('./../next-compiled/.next')) {
    //run yarn package
    const { exec } = require('child_process');
    console.log("Compiling nextjs app...")
    exec('yarn package', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}