import {app, getMQTTClient} from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import adminModules from 'protolib/adminapi'
import BundleAPI from 'app/bundles/adminapi'
import { logger } from './logger';

const modulesDir = path.join(__dirname, 'modules');
logger.debug('Admin modules: ', adminModules)

fs.readdir(modulesDir, (error, files) => {
    if (error) {
        return logger.error('Error reading modules directory: ' + error);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.ts') {
            require(path.join(modulesDir, file));
            logger.debug(`API Module loaded: ${file.substr(0, file.length-3)}`);
        }
    })
})

BundleAPI(app, {mqtt:getMQTTClient(logger)})
export default app