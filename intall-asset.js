const fs = require('fs');
const path = require('path');

const assetName = process.argv[2];
if (!assetName) {
    console.error('Please provide the asset name as an argument.');
    process.exit(1);
}
const sourceDir = path.join(__dirname,'data', 'assets', assetName);

if (!fs.existsSync(sourceDir)) {
    console.error(`Asset "${assetName}" does not exist in the source directory.`);
    process.exit(1);
}

const targetDir = path.join(__dirname);

copyFolderStructure(sourceDir, targetDir);

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