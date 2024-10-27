const moduleAlias = require('module-alias')
import path from 'path';

const resolveNodeModule = (moduleName) => {
  try {
    return require.resolve(moduleName);
  } catch (e) {
    // Handle the error if the module is not found
    console.error(`Module ${moduleName} not found`);
    return null;
  }
};

const moduleConfig = {
  "app": path.resolve(__dirname, "../../../packages/app"),
  "protolib": path.join(resolveNodeModule("protolib"), "..")
}

moduleAlias.addAliases(moduleConfig);

import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' });
import { getServiceToken } from 'protonode'
import { setConfig, getLogger } from 'protobase';
import { getBaseConfig } from '@my/config'
setConfig(getBaseConfig('api', process, getServiceToken()))
require('events').EventEmitter.defaultMaxListeners = 100;
const logger = getLogger()
import http from 'http';
global.defaultRoute = '/api/v1'
import app from './api'
//@ts-ignore
import { generateEvent } from 'app/bundles/library'
import chokidar from 'chokidar';

const isProduction = process.env.NODE_ENV === 'production';
const serviceName = isProduction?'api':'api-dev'
const server = http.createServer(app);
const PORT = 3001

server.listen(PORT, () => {
  logger.debug({ service: { protocol: "http", port: PORT } }, "Service started: HTTP")
});


generateEvent({
  path: 'services/'+serviceName+'/start', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
  from: serviceName, // system entity where the event was generated (next, api, cmd...)
  user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
  payload: {}, // event payload, event-specific data
}, getServiceToken())

if (process.env.NODE_ENV != 'production') {
  const pathsToWatch = [
    'src/**',
    '../../packages/app/bundles/**',
    '../../packages/app/apis/**',
    '../../packages/protolib/dist/**',
    '../../system.js',
    '../../packages/app/conf.ts',
    '../../packages/protonode/dist/**',
    '../../packages/protobase/dist/**',
  ];

  const watcher = chokidar.watch(pathsToWatch, {
    ignored: /^([.][^.\/\\])|([\/\\]+[.][^.])/,
    persistent: true
  });

  var restarting = false
  var restartTimer = null
  watcher.on('change', async (path) => {
    
    if (restarting) {
      clearTimeout(restartTimer)
    } else {
      console.log(`File ${path} has been changed, restarting...`);
      restarting = true
    }


    restartTimer = setTimeout(async () => {
      await generateEvent({
        path: 'services/' + serviceName + '/stop', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
        from: serviceName, // system entity where the event was generated (next, api, cmd...)
        user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
        payload: {}, // event payload, event-specific data
      }, getServiceToken())
      process.exit(0)
    }, 1000);
  })
}
