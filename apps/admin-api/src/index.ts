
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  "app": "../../../packages/app",
  "protolib": "../../../packages/protolib"
})

import dotenv from 'dotenv'
import { setConfig, getConfig } from 'protolib/base/Config';
import { getBaseConfig, getConfigWithoutSecrets } from '../../../packages/app/BaseConfig'
// get config vars
dotenv.config({ path: '../../.env' });
global.defaultRoute = '/adminapi/v1'
import { getServiceToken } from 'protolib/api/lib/serviceToken'
setConfig(getBaseConfig("admin-api", process, getServiceToken()))
import { getLogger } from 'protolib/base/logger';
import { app, getMQTTClient } from 'protolib/api'
import BundleAPI from '../../../packages/app/bundles/adminapi'
import adminModules from 'protolib/adminapi'
require('events').EventEmitter.defaultMaxListeners = 100;
import aedes from 'aedes';
import http from 'http';
import WebSocket, { Server } from 'ws';
import net from 'net';
import chokidar from 'chokidar';
import BundleContext from '../../../packages/app/bundles/adminapiContext'
import {API} from 'protolib/base'
import { startProxy } from './proxy';

const generateEvent = async (event, token='') => {
  try {
      await API.post('/adminapi/v1/events?token='+token, event)
  } catch(e) {
      //console.error("Failed to send event: ", e)
  }
}

const logger = getLogger()
const config = getConfig()

startProxy()

logger.info({ config: getConfigWithoutSecrets(config) }, "Service Started: admin-api")
logger.debug({ adminModules }, 'Admin modules: ', JSON.stringify(adminModules))
const isProduction = process.env.NODE_ENV === 'production';
const aedesInstance = new aedes();
aedesInstance.authenticate = function (client, username, password, callback) {
  if (!username) {
    logger.debug({}, "MQTT anonymous login request")
  } else {
    logger.debug({username}, "MQTT user login request: "+username)
  }

  if(config.mqtt.auth){
    if (!username || !password) {
      logger.error({}, "MQTT anonymous login refused: mqtt requires auth")
    } else {
      //TODO: auth
      callback(null, true)
    }
  } else{
    callback(null, true)
  }
}

const mqtt = getMQTTClient('admin-api', getServiceToken())

const topicSub = (topic, cb) => {
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

const topicPub = (topic, data) => {
  mqtt.publish(topic, data)
}

BundleAPI(app, { mqtt, topicSub, topicPub, ...BundleContext  })
const server = http.createServer(app);

const wss = new Server({ noServer: true });


wss.on('connection', (ws: WebSocket) => {
  const stream = WebSocket.createWebSocketStream(ws, { decodeStrings: false });
  aedesInstance.handle(stream as any);
});

server.on('upgrade', (request, socket, head) => {
  if (request.url === '/websocket') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

const PORT = isProduction ? 4002 : 3002

server.listen(PORT, () => {
  logger.debug({ service: { protocol: "http", port: PORT } }, "Service started: HTTP")
});

const mqttServer = net.createServer((socket) => {
  aedesInstance.handle(socket);
});

const mqttPort = isProduction ? 8883 : 1883
mqttServer.listen(mqttPort, () => {
  logger.debug({ service: { protocol: "mqtt", port: mqttPort } }, "Service started: MQTT")
  generateEvent({
    path: 'services/adminapi/start', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
    user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
    payload: {}, // event payload, event-specific data
  }, getServiceToken())
});

const isFullDev = process.env.DEV_ADMIN_API === '1';
if(isFullDev) {
  const pathsToWatch = [
    'src/**',
    '../../packages/protolib/**',
    '../../packages/app/bundles/adminapi.tsx'
  ];
  
  const watcher = chokidar.watch(pathsToWatch, {
    ignored: /^([.][^.\/\\])|([\/\\]+[.][^.])/,
    persistent: true
  });
  
  watcher.on('change', async (path) => {
    console.log(`File ${path} has been changed.`);
    await generateEvent({
      path: 'services/adminapi/stop', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
      from: 'admin-api', // system entity where the event was generated (next, api, cmd...)
      user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
      payload: {}, // event payload, event-specific data
    }, getServiceToken())
    process.exit(0)
  });
}
