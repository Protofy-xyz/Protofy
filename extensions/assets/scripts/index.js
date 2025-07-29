
const action = process.argv[2];
if (action == 'create') {

    if (process.argv.length < 3) {
        console.error('Please provide an asset name as the second parameter.');
        process.exit(1);
    }
    const assetName = process.argv[3];
    const create = require('./create').create;
    create(assetName);
}else if(action == 'prepare'){
    if (process.argv.length < 3) {
        console.error('Please provide an asset name as the second parameter.');
        process.exit(1);
    }
    const assetName = process.argv[3];
    const prepare = require('./prepare').prepare;
    prepare(assetName);
}else if(action == 'package'){
    if (process.argv.length < 3) {
        console.error('Please provide an asset name as the second parameter.');
        process.exit(1);
    }
    const assetName = process.argv[3];
    const package = require('./package').package;
    package(assetName);

}else if(action == 'clean'){
    if (process.argv.length < 3) {
        console.error('Please provide an asset name as the second parameter.');
        process.exit(1);
    }
    const assetName = process.argv[3];
    const clean = require('./clean').clean;
    clean(assetName);

}else{
    console.error('Invalid action');
    process.exit(1);
}

