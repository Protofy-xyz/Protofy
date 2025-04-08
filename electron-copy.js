const fs = require('fs-extra');
const path = require('path');

console.log('Copying node_modules into electron build...')
const sourceDir = path.join(__dirname, 'node_modules');
const destDir = path.join(__dirname, 'dist', 'win-unpacked', 'resources', 'app', 'node_modules');

//delete destDir if exists, including all its contents
if (fs.existsSync(destDir)) {
    fs.removeSync(destDir);
}
async function copyNodeModules() {
    try {
        await fs.copy(sourceDir, destDir, { dereference: true });
        console.log('node_modules copied successfully (symlinks resolved)!');
    } catch (err) {
        console.error('Error copying node_modules:', err);
    }
}

copyNodeModules()
    .then(() => {
        console.log('Copying completed!')
        //copy sourceDir/protolib/lib/RemoteTransport.ts to a created directory in destDir/@my/protolib/lib/RemoteTransport.ts
        const sourceFile = path.join(sourceDir, 'protolib', 'lib', 'RemoteTransport.ts');
        const destFile = path.join(destDir, '@my', 'protolib', 'lib', 'RemoteTransport.ts');
        const destDir2 = path.dirname(destFile);
        //create destDir2 if it does not exist
        if (!fs.existsSync(destDir2)) {
            fs.mkdirSync(destDir2, { recursive: true });
        }
        //copy file
        fs.copyFileSync(sourceFile, destFile);
    })
    .catch(err => console.error('Error during copying:', err));