import * as mqtt from 'mqtt';
import { getLogger } from '../../base';

const logger = getLogger()

const isProduction = process.env.NODE_ENV === 'production';
const mqttServer = process.env.MQTT_URL ?? ('mqtt://localhost:' + (isProduction ? '8883' : '1883'))
var mqttClient = null;

export const getMQTTClient = (username, password?) => {
    if (!mqttClient) {
        mqttClient = mqtt.connect(mqttServer, {
            username: username, 
            clientId: username + '_' + Math.random().toString(16).substr(2, 8),
            password: password
        });
        mqttClient.hasConnected = false
        mqttClient.retries = 0

        mqttClient.on('connect', function () {
            mqttClient.hasConnected = true
            mqttClient.retries = 0
            logger.info('Connected to MQTT');
        });

        mqttClient.on('reconnect', function () {
            if (mqttClient.hasConnected || mqttClient.retries > 10) {
                logger.info('Trying to connect MQTT...');
            }
        });

        mqttClient.on('offline', function () {
            if (mqttClient.hasConnected) {
                logger.info('MQTT disconnected');
            }
        });

        mqttClient.on('error', function (error) {
            if (mqttClient.hasConnected) {
                logger.error({ error }, "MQTT Error");
            }
        });
    }
    return mqttClient
}
