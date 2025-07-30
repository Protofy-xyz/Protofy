const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function unpackage(assetName) {
    const baseDir = path.resolve(__dirname, '../../../');
    const zipFilePath = path.join(baseDir, 'data/assets', `${assetName}.zip`);
    const outputDir = path.join(baseDir, 'data/assets', assetName);
    if (!fs.existsSync(zipFilePath)) {
        console.error(`Zip file "${zipFilePath}" does not exist.`);
        return;
    }

    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputDir, true);
    console.log(`Extracted "${zipFilePath}" to "${outputDir}".`);
}

module.exports = { unpackage };