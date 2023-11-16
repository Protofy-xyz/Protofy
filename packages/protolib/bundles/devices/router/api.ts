import {generateEvent} from 'app/bundles/library'
import {getServiceToken} from 'protolib/api/lib/serviceToken'

export const DeviceMessageRouter = (app, context) => {
    context.mqtt.subscribe("test", (err) => {
        if(err) {
            console.error("Error subscring to topic", err)
        }
    });

    context.mqtt.on("message", (topic, message) => {
        const parsedMessage = message.toString() //or JSON.parse(message.toString())
        console.log('# Message received in device router:', topic, )
        generateEvent({
            path: 'devices/xx/yy', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'device', // system entity where the event was generated (next, api, cmd...)
            user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {test: parsedMessage} // event payload, event-specific data
        }, getServiceToken())
    })
}