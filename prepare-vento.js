//move package-vento.json to package.json and rimraf node_modules

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const packageVentoPath = path.join(__dirname, 'package-vento.json');
const packagePath = path.join(__dirname, 'package.json');
// Check if package-vento.json exists
if (fs.existsSync(packageVentoPath)) {
    // Read the contents of package-vento.json
    const packageVentoContent = fs.readFileSync(packageVentoPath, 'utf8');
    // Write the contents to package.json
    fs.writeFileSync(packagePath, packageVentoContent, 'utf8');
    console.log('package-vento.json has been moved to package.json');
    // Remove package-vento.json
    fs.unlinkSync(packageVentoPath);
    console.log('package-vento.json has been removed');
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

//yarn creates symlinks in node_modules, so we need to remove them and copy the actual folders to it
//first remove all symlinks in node_modules/@extensions and node_modules/app node_modules/config node_modules/protobase node_modules/protodevice node_modules/protonode
//then copy the ACTUAL folders from extensions/* to node_modules/@extensions and from packages/app to node_modules/app, node_modules/config, node_modules/protobase, node_modules/protodevice, node_modules/protonode

const extensionsPath = path.join(__dirname, 'extensions');
const nodeModulesExtensionsPath = path.join(__dirname, 'node_modules', '@extensions');
const packagesPath = path.join(__dirname, 'packages');
const nodeModulesAppPath = path.join(__dirname, 'node_modules', 'app');
const nodeModulesConfigPath = path.join(__dirname, 'node_modules', 'config');
const nodeModulesProtobasePath = path.join(__dirname, 'node_modules', 'protobase');
const nodeModulesProtodevicePath = path.join(__dirname, 'node_modules', 'protodevice');
const nodeModulesProtonodePath = path.join(__dirname, 'node_modules', 'protonode');

const removeSymlinks = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isSymbolicLink()) {
                fs.unlinkSync(filePath);
                console.log(`Removed symlink: ${filePath}`);
            }   else if (fs.lstatSync(filePath).isDirectory()) {
                removeSymlinks(filePath); // Recursively remove symlinks in subdirectories
            }
        }
    );
    }
}  

removeSymlinks(nodeModulesExtensionsPath);
removeSymlinks(nodeModulesAppPath);
removeSymlinks(nodeModulesConfigPath);
removeSymlinks(nodeModulesProtobasePath);
removeSymlinks(nodeModulesProtodevicePath);
removeSymlinks(nodeModulesProtonodePath);

const copyDirectory = (src, dest) => {
    if (fs.existsSync(src)) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((file) => {
            const srcFilePath = path.join(src, file);
            const destFilePath = path.join(dest, file);
            if (fs.lstatSync(srcFilePath).isDirectory()) {
                copyDirectory(srcFilePath, destFilePath); // Recursively copy directories
            } else {
                fs.copyFileSync(srcFilePath, destFilePath);
                console.log(`Copied ${srcFilePath} to ${destFilePath}`);
            }
        });
    } else {
        console.warn(`Source directory does not exist: ${src}`);
    }
}

copyDirectory(extensionsPath, nodeModulesExtensionsPath);
copyDirectory(path.join(packagesPath, 'app'), nodeModulesAppPath);
copyDirectory(path.join(packagesPath, 'config'), nodeModulesConfigPath);
copyDirectory(path.join(packagesPath, 'protobase'), nodeModulesProtobasePath);
copyDirectory(path.join(packagesPath, 'protodevice'), nodeModulesProtodevicePath);
copyDirectory(path.join(packagesPath, 'protonode'), nodeModulesProtonodePath);
console.log('All directories have been copied to node_modules successfully.');