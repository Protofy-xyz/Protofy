const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Compress the folder /data/assets/<assetName> into /data/assets/<assetName>.zip
const package = (assetName) => {
    if (!assetName) {
        console.error('Please provide an asset name as a parameter.');
        process.exit(1);
    }

    
    
    const baseDir = path.resolve(__dirname, '../../../');
    // read asset.json from .vento folder
    const assetJsonPath = path.join(baseDir, 'data/assets/', assetName, ".vento", 'asset.json');
    if (!fs.existsSync(assetJsonPath)) {
        console.error(`Asset "${assetName}" does not have a valid asset.json file. Please create it first.`);
        process.exit(1);
    }
    const assetJson = JSON.parse(fs.readFileSync(assetJsonPath, 'utf8'));
    if (!assetJson.name || assetJson.name !== assetName) {
        console.error(`Asset "${assetName}" does not match the name in asset.json. Please check the asset.json file.`);
        process.exit(1);
    }
    const assetDir = path.join(baseDir, 'data/assets', assetName);
    const outputZip = path.join(baseDir, 'data/assets', `${assetName}.zip`);

    if (!fs.existsSync(assetDir)) {
        console.error(`Asset "${assetName}" does not exist. Please create it first.`);
        process.exit(1);
    }

    // Create the zip and add the folder
    try {
        const zip = new AdmZip();
        zip.addLocalFolder(assetDir, assetName); // preserve folder name inside the zip
        zip.writeZip(outputZip);
        console.log(`✔ Package created: ${outputZip}`);
    } catch (err) {
        console.error('❌ Failed to create zip:', err.message);
        process.exit(1);
    }

    console.log(`✔ Package process for "${assetName}" completed successfully.`);
};

module.exports = { package };
