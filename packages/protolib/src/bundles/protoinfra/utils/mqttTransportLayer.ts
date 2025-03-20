import * as mqtt from 'mqtt';
import{ getLogger } from 'protobase';

const logger = getLogger()

let client;

export const createMqttClient = (serverUrl, username, password?, onConnect?) => {
    client = mqtt.connect(serverUrl,{
        clientId: username + '_' + Math.random().toString(16).substr(2, 8),
        username, 
        password
    })
    client.hasConnected = false
    client.retries = 0

    logger.debug({serverUrl,username: username},"Connecting to MQTT")
    client.on('connect', function () {
        if(!client.hasConnected && onConnect) {
            onConnect(client)
        }
        client.hasConnected = true
        client.retries = 0
        logger.debug('Connected to MQTT');
    });

    client.on('reconnect', function () {
        if (client.hasConnected || client.retries > 10) {
            logger.debug('Trying to connect MQTT...');
        }
    });

    client.on('offline', function () {
        if (client.hasConnected) {
            logger.debug('MQTT disconnected');
        }
    });

    client.on('error', function (error) {
        if (client.hasConnected) {
            logger.error({ error }, "MQTT Error");
        }
    });
    return client
}