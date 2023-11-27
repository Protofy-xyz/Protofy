import { app, getMQTTClient } from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import BundleAPI from 'app/bundles/apis'
const modulesDir = path.join(__dirname, 'modules');

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

fs.readdir(modulesDir, (error, files) => {

    if (error) {
        return console.error('Error reading modules directory: ' + error);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.ts') {
            require(path.join(modulesDir, file));
            console.log(`API Module loaded: ${file.substr(0, file.length - 3)}`);
        }
    })
})

BundleAPI(app, { mqtt, devicePub, deviceSub })

export default app