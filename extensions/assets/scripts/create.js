
const fs = require('fs');
const path = require('path');

const create = (assetName) => {
    if (!assetName) {
        console.error('Please provide an asset name as a parameter.');
        process.exit(1);
    }
    const assetsReleasePath = path.join(__dirname, '../../../data/assets/', assetName + '/.vento/asset.json');
    const assetsReleaseContent = {
        "name": assetName,
        "description": "asset description",
        "author": "@author",
        "tags": [
            "tag1",
            "tag2"
        ],
        "version": "0.0.1", 
        "packagedFiles": [
        ]
    };
    // create the directory if it does not exist
    const dir = path.dirname(assetsReleasePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // write the content to the file
    fs.writeFileSync(assetsReleasePath, JSON.stringify(assetsReleaseContent, null, 4));
    console.log(`Created ${assetsReleasePath} with content:`, JSON.stringify(assetsReleaseContent, null, 4));
    // print the route wher the file was created
    console.log(`File created at: ${assetsReleasePath}`);
}

module.exports = { create };