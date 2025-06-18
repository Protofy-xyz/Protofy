//move package-vento.json to package.json and rimraf node_modules

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { exec } = require('child_process');

const packageVentoPath = path.join(__dirname, 'package-vento.json');
const packagePath = path.join(__dirname, 'package.json');
// Check if package-vento.json exists
if (fs.existsSync(packageVentoPath)) {
    // Read the contents of package-vento.json
    const packageVentoContent = fs.readFileSync(packageVentoPath, 'utf8');
    // Write the contents to package.json
    fs.writeFileSync(packagePath, packageVentoContent, 'utf8');
    console.log('package-vento.json has been moved to package.json');
}

// Remove node_modules directory
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
    rimraf.sync(nodeModulesPath);
    console.log('node_modules directory has been removed');
}

//run yarn
const { exec } = require('child_process');
exec('yarn', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing yarn: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Yarn stderr: ${stderr}`);
        return;
    }
    console.log(`Yarn stdout: ${stdout}`);
});

//remove apps/adminpanel/.next
const nextPath = path.join(__dirname, 'apps', 'adminpanel', '.next');
if (fs.existsSync(nextPath)) {
    rimraf.sync(nextPath);
    console.log('.next directory in apps/adminpanel has been removed');
}

//remove apps/adminpanel/out

const outPath = path.join(__dirname, 'apps', 'adminpanel', 'out');
if (fs.existsSync(outPath)) {
    rimraf.sync(outPath);
    console.log('out directory in apps/adminpanel has been removed');
}

//remove .yarn/cache
const yarnCachePath = path.join(__dirname, '.yarn', 'cache');
if (fs.existsSync(yarnCachePath)) {
    rimraf.sync(yarnCachePath);
    console.log('.yarn/cache directory has been removed');
}


//check if its running on windows and remove bin/node-linux and bin/node-macos
const binPathLinux = path.join(__dirname, 'bin', 'node-linux');
const binPathMacos = path.join(__dirname, 'bin', 'node-macos');
if (process.platform === 'win32') {
    if (fs.existsSync(binPathLinux)) {
        rimraf.sync(binPathLinux);
        console.log('bin/node-linux has been removed');
    }
    if (fs.existsSync(binPathMacos)) {
        rimraf.sync(binPathMacos);
        console.log('bin/node-macos has been removed');
    }
}

//convert git to a shallow clone, remove .git/objects and .git/refs
const gitObjectsPath = path.join(__dirname, '.git', 'objects');
const gitRefsPath = path.join(__dirname, '.git', 'refs');
if (fs.existsSync(gitObjectsPath)) {
    rimraf.sync(gitObjectsPath);
    console.log('.git/objects has been removed');
}
if (fs.existsSync(gitRefsPath)) {
    rimraf.sync(gitRefsPath);
    console.log('.git/refs has been removed');
}

//run git init
const gitInitCommand = 'git init';
exec(gitInitCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing git init: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Git init stderr: ${stderr}`);
        return;
    }
    console.log(`Git init stdout: ${stdout}`);
});

//run git fetch --depth=1 origin main
const gitFetchCommand = 'git fetch --depth=1 origin main';
exec(gitFetchCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing git fetch: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Git fetch stderr: ${stderr}`);
        return;
    }
    console.log(`Git fetch stdout: ${stdout}`);
});
