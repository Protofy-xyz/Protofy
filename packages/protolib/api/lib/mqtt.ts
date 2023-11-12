import * as mqtt from 'mqtt';

export const mqttClient = mqtt.connect('mqtt://localhost');

mqttClient.on('connect', function () {
    console.log('Connected to MQTT');
});

mqttClient.on('reconnect', function () {
    console.log('Reconnecting to MQTT...');
});

mqttClient.on('offline', function () {
    console.log('MQTT disconnected');
});

mqttClient.on('error', function (error) {
    console.log('MQTT Error:', error);
});

