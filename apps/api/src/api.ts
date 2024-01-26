import { app, getMQTTClient } from 'protolib/api'
import BundleAPI from 'app/bundles/apis'
import {getLogger } from 'protolib/base';
const logger = getLogger()
const mqtt = getMQTTClient()

const topicSub = (topic, cb) => {
    mqtt.subscribe(topic)
    mqtt.on("message", (topic, message) => {
        const parsedMessage = message.toString();
        cb(parsedMessage, topic)
    });
};

const topicPub = (topic, data) => {
    mqtt.publish(topic, data)
}

const deviceSub = (deviceName, component, componentName, cb) => {
    return topicSub(deviceName + '/' + component + '/' + componentName + '/state', cb)
}

const devicePub = async (deviceName, component, componentName, command) => {
    if (typeof command == "string") {
        topicPub(deviceName + '/' + component + '/' + componentName + '/command', command)
    } else {
        topicPub(deviceName + '/' + component + '/' + componentName + '/command', JSON.stringify(command))
    }
}


BundleAPI(app, { mqtt, devicePub, deviceSub })
export default app