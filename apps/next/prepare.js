const fs = require('fs')
const path = require('path')

const content = `IGNORE_TS_CONFIG_PATHS=true
TAMAGUI_TARGET=web
TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1
NEXT_PUBLIC_MAPBOX_TOKEN=PUT_HERE_YOUR_API_KEY
`

if (!fs.existsSync('./../../.env')) {
    fs.appendFileSync('./../../.env', content)
} else {
    const fileContent = fs.readFileSync('./../../.env').toString()
    if (!fileContent.includes('TAMAGUI_TARGET')) {
        fs.appendFileSync('./../../.env', content)
    }
}

if (!fs.existsSync('./../next-compiled/.next')) {
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

function copyFiles(source, target, skip=['prod', 'dev', '[...page].tsx', 'index.tsx']) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
        if(skip.includes(file)) return
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);

        const stat = fs.statSync(sourcePath);

        if (stat.isDirectory()) {
            fs.mkdirSync(targetPath);
            copyFiles(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

//dev
try {
    fs.rmSync('./pages/workspace/dev', { recursive: true })
} catch(e) {}

fs.mkdirSync('./pages/workspace/dev', { recursive: true })
copyFiles('./pages/workspace', './pages/workspace/dev')

//prod
try {
    fs.rmSync('./pages/workspace/prod', { recursive: true })
} catch(e) {}

fs.mkdirSync('./pages/workspace/prod', { recursive: true })
copyFiles('./pages/workspace', './pages/workspace/prod')