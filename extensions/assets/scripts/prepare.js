const fs = require('fs');
const path = require('path');

const listFilesRecursively = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(listFilesRecursively(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
};

const matchPattern = (baseDir, pattern) => {
    if (pattern.endsWith('/**')) {
        const subdir = pattern.slice(0, -3); // remove "/**"
        const fullPath = path.join(baseDir, subdir);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
            return listFilesRecursively(fullPath);
        } else {
            console.warn(`Warning: pattern "${pattern}" points to invalid directory.`);
            return [];
        }
    } else if (fs.existsSync(path.join(baseDir, pattern))) {
        return [path.join(baseDir, pattern)];
    } else {
        console.warn(`Warning: file or pattern "${pattern}" not found.`);
        return [];
    }
};

const prepare = (assetName) => {
    if (!assetName) {
        console.error('Please provide an asset name as a parameter.');
        process.exit(1);
    }

    const baseDir = path.resolve(__dirname, '../../../');
    const assetJsonPath = path.join(baseDir, 'data/assets', assetName, '.vento/asset.json');

    if (!fs.existsSync(assetJsonPath)) {
        console.error(`Asset ${assetName} does not exist. Please create it first.`);
        process.exit(1);
    }

    let asset;
    try {
        asset = JSON.parse(fs.readFileSync(assetJsonPath, 'utf8'));
    } catch (err) {
        console.error('Failed to parse asset.json:', err.message);
        process.exit(1);
    }

    if (!asset.name || asset.name !== assetName) {
        console.error(`Asset name in asset.json (${asset.name}) does not match the provided name (${assetName}).`);
        process.exit(1);
    }

    if (!Array.isArray(asset.packagedFiles)) {
        console.error('Invalid or missing "packagedFiles" in asset.json.');
        process.exit(1);
    }

    asset.packagedFiles.forEach(pattern => {
        const matchedFiles = matchPattern(baseDir, pattern);

        matchedFiles.forEach(file => {
            const relativePath = path.relative(baseDir, file);
            const destPath = path.join(baseDir, 'data/assets', assetName, relativePath);
            const destDir = path.dirname(destPath);

            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }

            fs.copyFileSync(file, destPath);
            console.log(`Copied: ${relativePath}`);
        });
    });

    console.log(`✔ Prepared asset "${assetName}"`);
};

module.exports = { prepare };
