const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function copyFolderStructure(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Source folder "${sourceDir}" does not exist.`);
        return;
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(sourceDir, entry.name);
        const destPath = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            // Create the directory in the destination if it doesn't exist
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyFolderStructure(srcPath, destPath);
        } else if (entry.isFile()) {
            // Copy the file if it doesn't exist in the destination
            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
            } else {
                // If the file already exists, you can choose to skip or overwrite
            }
        }
    }
}

function installAsset(assetName) {
    if (!assetName) {
        console.error('Please provide the asset name as an argument.');
        process.exit(1);
    }
    const sourceDir = path.join(__dirname, 'data', 'assets', assetName);

    if (!fs.existsSync(sourceDir)) {
        console.error(`Asset "${assetName}" does not exist in the source directory.`);
        process.exit(1);
    }

    const targetDir = path.join(__dirname);

    copyFolderStructure(sourceDir, targetDir);
    execSync(`yarn`, { stdio: 'inherit' });
}

function packageAsset(assetName) {

}

// check if directly run or is a module
if (require.main === module) {
    const command = process.argv[2];
    const assetName = process.argv[3];

    if (!assetName) {
        console.error('Please provide the asset name as an argument.');
        process.exit(1);
    }

    if (command == 'install') {
        installAsset(assetName);
    } else if (command === 'package') {
        packageAsset(assetName);
    }
}

module.exports = {
    install: installAsset,
    package: packageAsset
};