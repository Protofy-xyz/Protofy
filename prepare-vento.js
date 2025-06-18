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