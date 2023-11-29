import dotenv from 'dotenv'
// get config vars
dotenv.config();

import aedes from 'aedes';
import http from 'http';
import WebSocket, { Server } from 'ws';
import net from 'net';
import app from './api'
import {generateEvent} from 'app/bundles/library'

const isProduction = process.env.NODE_ENV === 'production';
const aedesInstance = new aedes();
const server = http.createServer(app);

// Crea un WebSocket server
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

const PORT = isProduction?4002:3002

server.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
});

const mqttServer = net.createServer((socket) => {
  aedesInstance.handle(socket);
});

const mqttPort = isProduction? 8883 : 1883
mqttServer.listen(mqttPort, () => {
  console.log('MQTT server listening on port '+mqttPort);
});

// generateEvent({
//   path: 'services/start/adminapi', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
//   from: 'api', // system entity where the event was generated (next, api, cmd...)
//   user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
//   payload: {}, // event payload, event-specific data
// })