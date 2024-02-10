import { app, getMQTTClient } from 'protolib/api'
import BundleAPI from 'app/bundles/apis'
import {getLogger } from 'protolib/base';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
const logger = getLogger()
const mqtt = getMQTTClient('api', getServiceToken())

const topicSub = (topic, cb) => {
    mqtt.subscribe(topic)
    mqtt.on("message", (messageTopic, message) => {
        if (topic != messageTopic) return
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