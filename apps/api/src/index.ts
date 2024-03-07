import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' });
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { setConfig, getConfig } from 'protolib/base/Config';
import { getBaseConfig, getConfigWithoutSecrets } from 'app/BaseConfig'
setConfig(getBaseConfig('api', process, getServiceToken()))
import { getLogger } from 'protolib/base/logger';
require('events').EventEmitter.defaultMaxListeners = 100;
const logger = getLogger()
const config = getConfig()
import http from 'http';
global.defaultRoute = '/api/v1'
import app from './api'
import { generateEvent } from 'app/bundles/library'
import chokidar from 'chokidar';

const isProduction = process.env.NODE_ENV === 'production';

const server = http.createServer(app);
const PORT = isProduction ? 4001 : 3001

logger.info({ config: getConfigWithoutSecrets(config) }, "Service Started: api")

server.listen(PORT, () => {
  logger.debug({ service: { protocol: "http", port: PORT } }, "Service started: HTTP")
});


generateEvent({
  path: 'services/api/start', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
  from: 'api', // system entity where the event was generated (next, api, cmd...)
  user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
  payload: {}, // event payload, event-specific data
}, getServiceToken())

if (process.env.NODE_ENV != 'production') {
  const pathsToWatch = [
    'src/**',
    '../../packages/protolib/**',
    '../../packages/app/bundles/**'
  ];

  const watcher = chokidar.watch(pathsToWatch, {
    ignored: /(^|[/\\])\../,
    persistent: true
  });

  watcher.on('change', async (path) => {
    console.log(`File ${path} has been changed.`);
    await generateEvent({
      path: 'services/api/stop', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
      from: 'api', // system entity where the event was generated (next, api, cmd...)
      user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
      payload: {}, // event payload, event-specific data
    }, getServiceToken())
    process.exit(0)
  });
}
