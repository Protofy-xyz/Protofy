// This script receives two parameters first is "action" and second called "assetName"
// The first parameter defines the action to be performed, in this case, it should be "create"
// The second parameter is the name of the asset to be created
// I want to create a new file called assets-release.json in root directory of the project
// and add the following content to it:
/*
[
    {
        "name": "asset-name",
        "files": [
        ]
    }
]
*/

const fs = require('fs');
const path = require('path');

const action = process.argv[2];
if (action !== 'create') {
    console.error('Invalid action. Please use "create" as the first parameter.');
    process.exit(1);
}
if (process.argv.length < 3) {
    console.error('Please provide an asset name as the second parameter.');
    process.exit(1);
}
const assetName = process.argv[3];

if (!assetName) {
    console.error('Please provide an asset name as a parameter.');
    process.exit(1);
}
const assetsReleasePath = path.join(__dirname, '../../../data/assets/', assetName + '/.vento/asset.json');
const assetsReleaseContent = [
    {
        "name": assetName,
        "files": [
        ]
    }
];
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
// This script is intended to be run in a Node.js environment
// and expects the asset name to be passed as a command line argument.
// Example usage: node scripts/assets.js whatsapp
// This will create a file named assets-release.json in the root directory
// with the specified asset name and file structure.