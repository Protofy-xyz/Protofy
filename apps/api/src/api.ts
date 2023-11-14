import {app, mqttClient} from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import BundleAPI from 'app/bundles/apis'
const modulesDir = path.join(__dirname, 'modules');

fs.readdir(modulesDir, (error, files) => {
    if (error) {
        return console.error('Error reading modules directory: ' + error);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.ts') {
            require(path.join(modulesDir, file));
            console.log(`API Module loaded: ${file.substr(0, file.length-3)}`);
        }
    })
})

BundleAPI(app, {mqtt:mqttClient})

export default app