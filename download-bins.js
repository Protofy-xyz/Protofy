const fs = require('fs')
//TODO: add support for other platforms
const nodeSources = {
    win: 'https://nodejs.org/dist/v20.17.0/win-x64/node.exe',
}
//get platform: win32, linux, darwin
const platform = process.platform === 'win32' ? 'win' : process.platform === 'linux' ? 'linux' : process.platform === 'darwin' ? 'mac' : null

if(!platform || !nodeSources[platform]){
    console.error('Platform not supported!')
    process.exit(1)
}
//get filename from nodeSources
const nodeSource = nodeSources[platform]
//get filename from nodeSource
const filename = nodeSource.split('/').pop()


//check if bin contains node.exe if not, download
const nodePath = './bin/'+filename

if (!fs.existsSync(nodePath)) {
    console.log('Downloading node...')
    const https = require('https');
    const fs = require('fs');
    const file = fs.createWriteStream(nodePath);
    https.get(nodeSource, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            console.log('Node downloaded to bin folder!')
        });
    });
} else {
    console.log('Node already exists in bin folder!')
    console.log('If you want to redownload it, delete the node.exe file in the bin folder!')
}