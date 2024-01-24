import * as mqtt from 'mqtt';

const isProduction = process.env.NODE_ENV === 'production';
const mqttServer = process.env.MQTT_URL ?? ('mqtt://localhost:'+(isProduction?'8883':'1883'))
var mqttClient = null;

export const getMQTTClient = (logger) => {
    if(!mqttClient) {
        mqttClient = mqtt.connect(mqttServer);
        
        mqttClient.on('connect', function () {
            logger.info('Connected to MQTT');
        });

        mqttClient.on('reconnect', function () {
            logger.info('Reconnecting to MQTT...');
        });

        mqttClient.on('offline', function () {
            logger.info('MQTT disconnected');
        });

        mqttClient.on('error', function (error) {
            logger.error('MQTT Error:', error);
        });
    }
    return mqttClient
}
