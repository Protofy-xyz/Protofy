const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function copyFolderStructure(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Source folder "${sourceDir}" does not exist.`);
        return;
    }

    // .vento is a config folder that should not be copied
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true }).filter(entry => entry.name != ".vento" );
    
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

export function installAsset(assetName) {
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
    execSync(`pm2 restart api-dev`, { stdio: 'inherit' });
}

export function packageAsset(assetName) {

}