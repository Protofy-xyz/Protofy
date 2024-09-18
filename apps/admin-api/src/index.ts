
import path from 'path'
const moduleAlias = require('module-alias')

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
import { setConfig, getConfig, getLogger } from 'protobase';
import { getBaseConfig, getConfigWithoutSecrets } from '@my/config'
// get config vars
dotenv.config({ path: '../../.env' });
global.defaultRoute = '/adminapi/v1'
import { getServiceToken, getApp, getMQTTClient } from 'protonode'
setConfig(getBaseConfig("admin-api", process, getServiceToken()))
import adminModules from './adminapi'
require('events').EventEmitter.defaultMaxListeners = 100;

import http from 'http';

import chokidar from 'chokidar';
import BundleContext from 'app/bundles/adminApiContext'
//@ts-ignore
import { generateEvent } from 'app/bundles/library'
import { startMqtt } from './mqtt';

const config = getConfig()
const logger = getLogger()

const app = getApp()

process.on('uncaughtException', function (err) {
  logger.error({ err }, 'Uncaught Exception: ', err.message)
});

startMqtt(config)
logger.info({ config: getConfigWithoutSecrets(config) }, "Service Started: admin-api")
logger.debug({ adminModules }, 'Admin modules: ', JSON.stringify(adminModules))
const devMqtt = getMQTTClient('dev', 'admin-api', getServiceToken())
const prodMqtt = getMQTTClient('prod', 'admin-api', getServiceToken())

const topicSub = (mqtt, topic, cb) => {
  mqtt.subscribe(topic)
  mqtt.on("message", (messageTopic, message) => {
    const isWildcard = topic.endsWith("#");
    if (!isWildcard && topic != messageTopic) {
      return
    }
    if (isWildcard && !messageTopic.startsWith(topic.slice(0, -1).replace(/\/$/, ''))) {
      return
    }
    const parsedMessage = message.toString();
    cb(parsedMessage, messageTopic)
  });
};

const topicPub = (mqtt, topic, data) => {
  mqtt.publish(topic, data)
}

try {
  import('app/bundles/adminapi').then((BundleAPI) => {
    BundleAPI.default(app, { mqtt: devMqtt, mqtts: { prod: prodMqtt, dev: devMqtt }, topicSub, topicPub, ...BundleContext })
  })

} catch (error) {
  logger.error({ error: error.toString() }, "Server error")
}

const server = http.createServer(app);
const PORT = 3002
server.listen(PORT, () => {
  logger.debug({ service: { protocol: "http", port: PORT } }, "Service started: HTTP")
  generateEvent({
    path: 'services/adminapi/start', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
    user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
    payload: {}, // event payload, event-specific data
  }, getServiceToken())
});

const isFullDev = process.env.FULL_DEV === '1';

if (isFullDev) {
  const pathsToWatch = [
    'src/**',
    '../../packages/app/conf.ts',
    '../../packages/protolib/dist/**',
    '../../packages/app/bundles/adminapi.tsx',
    '../../system.js',
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
        path: 'services/adminapi/stop', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
        from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
        user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
        payload: {}, // event payload, event-specific data
      }, getServiceToken())
      process.exit(0)
    }, 1000);
  })
}
