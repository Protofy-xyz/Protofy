const [,, action, assetName] = process.argv;

if (!assetName) {
    console.error('Please provide an asset name as the second parameter.');
    process.exit(1);
}

const actions = {
    create: { module: './create', fn: 'create' },
    prepare: { module: './prepare', fn: 'prepare' },
    package: { module: './package', fn: 'package' },
    clean: { module: './clean', fn: 'clean' },
    install: { module: './install', fn: 'installAsset' },
    unpackage: { module: './unpackage', fn: 'unpackage' }
};

const entry = actions[action];

if (!entry) {
    console.error('Invalid action');
    process.exit(1);
}

const func = require(entry.module)[entry.fn];
func(assetName);
