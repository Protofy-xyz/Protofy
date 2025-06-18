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
