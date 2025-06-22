//scricpt to shrink the project by removing unnecessary files and directories
//useful to create a smaller package for distribution

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { execSync } = require('child_process');

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
execSync('yarn', (error, stdout, stderr) => {
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

const disableGit = true
if(!disableGit) {
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
    execSync(gitInitCommand, (error, stdout, stderr) => {
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
    execSync(gitFetchCommand, (error, stdout, stderr) => {
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
}


//remove unnecesary dependencies from node_modules:
const dependenciesToRemove = [
    'electron',
    'electron-builder',
    'electron-publish',
    'electron-to-chromium',
    'app-builder-bin'
];

dependenciesToRemove.forEach(dep => {
    const depPath = path.join(__dirname, 'node_modules', dep);
    if (fs.existsSync(depPath)) {
        rimraf.sync(depPath);
        console.log(`Removed ${dep} from node_modules`);
    } else {
        console.log(`${dep} not found in node_modules`);
    }
});

//remove symlink dependencies in node_modules, by iterating through node_modules and checking if the item is a symlink, if it is, remove it
//also iterate node_modules/@extensions and node_modules/@my
const pathsToCheck = [
    path.join(__dirname, 'node_modules'),
    path.join(__dirname, 'node_modules', '@extensions'),
    path.join(__dirname, 'node_modules', '@my')
];

pathsToCheck.forEach(basePath => {
    if (fs.existsSync(basePath)) {
        fs.readdirSync(basePath).forEach(item => {
            const itemPath = path.join(basePath, item);
            if (fs.lstatSync(itemPath).isSymbolicLink()) {
                rimraf.sync(itemPath);
                console.log(`Removed symlink: ${itemPath}`);
            }
        });
    }
});

//remove .env
// const envPath = path.join(__dirname, '.env');
// if (fs.existsSync(envPath)) {
//     fs.unlinkSync(envPath);
//     console.log('.env file has been removed');
// }

//remove data/databases/* (and all its subdirectories and files)
const dataPath = path.join(__dirname, 'data', 'databases');
if (fs.existsSync(dataPath)) {
    fs.readdirSync(dataPath).forEach(file => {
        const filePath = path.join(dataPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            rimraf.sync(filePath);
            console.log(`Removed directory: ${filePath}`);
        } else {
            fs.unlinkSync(filePath);
            console.log(`Removed file: ${filePath}`);
        }
    });
} else {
    console.log('data/databases directory does not exist');
}

//remove logs/* except for logs/.keep
const logsPath = path.join(__dirname, 'logs');
if (fs.existsSync(logsPath)) {
    fs.readdirSync(logsPath).forEach(file => {
        const filePath = path.join(logsPath, file);
        if (file !== '.keep') { // Keep the .keep file
            if (fs.lstatSync(filePath).isDirectory()) {
                rimraf.sync(filePath);
                console.log(`Removed directory: ${filePath}`);
            } else {
                fs.unlinkSync(filePath);
                console.log(`Removed file: ${filePath}`);
            }
        }
    });
}