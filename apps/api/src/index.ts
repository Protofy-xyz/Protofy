const moduleAlias = require('module-alias')
import path from 'path';

moduleAlias.addAliases({
  "app": path.resolve(__dirname, '../../../packages/app'),
  "protolib": path.resolve(__dirname, '../../../packages/protolib/src')
});

import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' });
import { getServiceToken } from 'protonode'
import { setConfig, getLogger } from 'protobase';
import { getBaseConfig } from 'app/BaseConfig'
setConfig(getBaseConfig('api', process, getServiceToken()))
require('events').EventEmitter.defaultMaxListeners = 100;
const logger = getLogger()
import http from 'http';
global.defaultRoute = '/api/v1'
import app from './api'
import { generateEvent } from 'app/bundles/library'
import chokidar from 'chokidar';

const isProduction = process.env.NODE_ENV === 'production';
const serviceName = isProduction?'api':'api-dev'
const server = http.createServer(app);
const PORT = isProduction ? 4001 : 3001

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
    '../../packages/protolib/**',
    '../../system.js',
    '../../packages/app/conf.ts'
  ];

  const watcher = chokidar.watch(pathsToWatch, {
    ignored: /^([.][^.\/\\])|([\/\\]+[.][^.])/,
    persistent: true
  });

  watcher.on('change', async (path) => {
    console.log(`File ${path} has been changed.`);
    await generateEvent({
      path: 'services/'+serviceName+'/stop', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
      from: serviceName, // system entity where the event was generated (next, api, cmd...)
      user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
      payload: {}, // event payload, event-specific data
    }, getServiceToken())
    process.exit(0)
  });
}
