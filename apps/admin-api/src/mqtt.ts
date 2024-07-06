
import WebSocket, { Server } from 'ws';
import net from 'net';
import aedes from 'aedes';
import { getLogger } from 'protobase';

const logger = getLogger()

export const startMqtt = (config) => {
    _startMqtt(config, 1883, 3003)
    _startMqtt(config, 8883, 4003)
}

const _startMqtt = (config, mqttPort, webSocketPort) => {
    const aedesInstance = new aedes();
    aedesInstance.authenticate = function (client, username, password, callback) {
        if (!username) {
            logger.debug({}, "MQTT anonymous login request")
        } else {
            logger.debug({ username }, "MQTT user login request: " + username)
        }

        if (config.mqtt.auth) {
            if (!username || !password) {
                logger.error({}, "MQTT anonymous login refused: mqtt requires auth")
            } else {
                //TODO: auth
                callback(null, true)
            }
        } else {
            callback(null, true)
        }
    }
    
    const wss = new Server({
        path: '/websocket',
        port: webSocketPort
    });

    wss.on('connection', (ws: WebSocket) => {
        const stream = WebSocket.createWebSocketStream(ws, { decodeStrings: false });
        aedesInstance.handle(stream as any);
    });

    const mqttServer = net.createServer((socket) => {
        aedesInstance.handle(socket);
    });

    mqttServer.listen(mqttPort, () => {
        logger.debug({ service: { protocol: "mqtt", port: mqttPort } }, "Service started: MQTT")
    });
}