const fs = require('fs');
const path = require('path');

// Compress the folder /data/assets/<assetName> into /data/assets/<assetName>.zip
const clean = (assetName) => {
    if (!assetName) {
        console.error('Please provide an asset name as a parameter.');
        process.exit(1);
    }
    const assetDir = path.join(__dirname, '../../../data/assets', assetName);
    if (!fs.existsSync(assetDir)) {
        console.error(`Asset "${assetName}" does not exist. Please create it first.`);
        process.exit(1);
    }

    // remove all the files in the asset directory except for the .vento folder
    const files = fs.readdirSync(assetDir);
    files.forEach(file => {
        const filePath = path.join(assetDir, file);
        if (file !== '.vento') {
            fs.rmSync(filePath, { recursive: true, force: true });
            console.log(`✔ Deleted file: ${filePath}`);
        }
    });

    console.log(`✔ Clean process for "${assetName}" completed successfully.`);
};

module.exports = { clean };