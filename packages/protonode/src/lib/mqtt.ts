import * as mqtt from 'mqtt';
import { getLogger } from 'protobase';

const logger = getLogger()

var mqttClient

export const getMQTTClient = (username, password?, onConnect?) => {
    if (!mqttClient) {
        const mqttServer = process.env.MQTT_URL ?? 'mqtt://localhost:1883'
        mqttClient = mqtt.connect(mqttServer, {
            username: username, 
            clientId: username + '_' + Math.random().toString(16).substr(2, 8),
            password: password
        });
        mqttClient.hasConnected = false
        mqttClient.retries = 0

        logger.debug({
            mqttServer: mqttServer,
            username: username
        },"Connecting to MQTT")

        mqttClient.on('connect', function () {
            if(!mqttClient.hasConnected && onConnect) {
                onConnect(mqttClient)
            }
            mqttClient.hasConnected = true
            mqttClient.retries = 0
            logger.debug('Connected to MQTT');
        });

        mqttClient.on('reconnect', function () {
            if (mqttClient.hasConnected || mqttClient.retries > 10) {
                logger.debug('Trying to connect MQTT...');
            }
        });

        mqttClient.on('offline', function () {
            if (mqttClient.hasConnected) {
                logger.debug('MQTT disconnected');
            }
        });

        mqttClient.on('error', function (error) {
            if (mqttClient.hasConnected) {
                logger.error({ error }, "MQTT Error");
            }
        });

        mqttClient = mqttClient
    }
    return mqttClient
}
