import dotenv from 'dotenv'
// get config vars
dotenv.config();

import aedes from 'aedes';
import http from 'http';
import WebSocket, { Server } from 'ws';
import net from 'net';
import app from './api'

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

server.listen(3001, () => {
  console.log(`Express server listening at http://localhost:${3001}`);
});

const mqttServer = net.createServer((socket) => {
  aedesInstance.handle(socket);
});

mqttServer.listen(1883, () => {
  console.log('MQTT server listening on port 1883');
});




  
