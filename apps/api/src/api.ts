import { app, getMQTTClient } from 'protolib/api'
import { getLogger, getApiUrl } from 'protolib/base';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { getPeripheralTopic } from 'protolib/bundles/devices/devices/devicesSchemas';
import { getConfigWithoutSecrets } from 'app/BaseConfig'
import { getConfig } from 'protolib/base/Config';
import BundleContext from 'app/bundles/apiContext'
import { generateEvent } from 'protolib/bundles/events/eventsLibrary';

const logger = getLogger()
const subscriptions = {}
//wait for mqtt before starting api server
const mqtt = getMQTTClient('api', getServiceToken(), async () => {
    logger.debug({ config: getConfigWithoutSecrets(getConfig()) }, "Service Started: api")

    const topicSub = (topic, cb) => { //all = continuous, single = just one, change = first change
        mqtt.subscribe(topic)
        const subscriptionId = Math.random().toString(36).substring(2)
        if(!subscriptions[topic]) {
            subscriptions[topic] = {}
        }
        subscriptions[topic][subscriptionId] = cb
        return () => {
            delete subscriptions[topic][subscriptionId]
            if(Object.keys(subscriptions[topic]).length === 0) {
                mqtt.unsubscribe(topic)
                delete subscriptions[topic]
            }
        }
    };

    const topicPub = (topic, data) => {
        mqtt.publish(topic, data)
    }

    const deviceSub = async (deviceName, component, monitorName, cb) => {
        var data = null
        const SERVER = getApiUrl()
        try {
            const urlDevices = `${SERVER}/adminapi/v1/devices`
            const res = await fetch(urlDevices);
            data = await res.json();
        } catch (err) {
            return;
        }
        const devices = data.items
        const device = devices.filter((e) => { return e.name == deviceName })
        var endpoint = null;
        var type = null;
        if (device[0].subsystem) {
            const subsystem = device[0].subsystem.filter((e) => { return e.name == component })[0]
            // console.log("subsystem: ", subsystem)
            const monitors = subsystem.monitors
            const monitor = monitors.filter((e) => { return e.name == monitorName })[0]
            // console.log("monitor: ", monitor)
            if (!monitor) return
            endpoint = monitor.endpoint
        } else {
            return;
        }
        if (!endpoint) return
        const done = topicSub(getPeripheralTopic(deviceName, endpoint), (message, topic) => {
            cb(message, topic, done)
        })
    }

    const devicePub = async (deviceName, component, componentName, payload?, cb?, errorCb?) => {
        var data = null;
        const SERVER = getApiUrl()
        try {
            const urlDevices = `${SERVER}/adminapi/v1/devices`
            const res = await fetch(urlDevices);
            data = await res.json();
        } catch (err) {
            errorCb && errorCb(err)
            return;
        }
        const devices = data.items
        const device = devices.filter((e) => { return e.name == deviceName })
        var endpoint = null;
        var type = null;
        var value = null;
        if (device[0].subsystem) {
            const subsystem = device[0].subsystem.filter((e) => { return e.name == component })[0]
            // console.log("subsystem: ", subsystem)
            const actions = subsystem.actions
            const action = actions.filter((e) => { return e.name == componentName })[0]
            // console.log("action: ", action)
            if (!action) {
                errorCb && errorCb("Action not found")
                return;
            }
            endpoint = action.endpoint
            type = action.payload.type;
            value = action.payload.value
        } else {
            errorCb && errorCb("Subsystem not found")
            return;
        }
        if (!endpoint) {
            errorCb && errorCb("Endpoint not found")
            return;
        }
        if (payload) {
            topicPub(getPeripheralTopic(deviceName, endpoint), String(payload))
        } else {
            if (type == 'str') {
                topicPub(getPeripheralTopic(deviceName, endpoint), value)
            }
            if (type == 'json') {
                topicPub(getPeripheralTopic(deviceName, endpoint), JSON.stringify(value))
            }
        }
        if (cb) cb()
    }

    try {
        const BundleAPI = await import('app/bundles/apis');
         //wait for mqtt before starting API
        BundleAPI.default(app, { mqtt, devicePub, deviceSub, topicPub, topicSub, ...BundleContext })
    } catch (error) {
        generateEvent({
            path: 'services/api/crash', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'api', // system entity where the event was generated (next, api, cmd...)
            user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {error: error.toString()}, // event payload, event-specific data
        }, getServiceToken())
        logger.error({ error: error.toString() }, "Server error")
    }

})

mqtt.on("message", (messageTopic, message) => {
    const topic = messageTopic.toString()
    let parsedMessage = message.toString()
    try {
        parsedMessage = JSON.parse(parsedMessage);
    } catch (err) { }

    if(subscriptions[topic]) {
        // Handle wildcard subscriptions
        const validSubscriptions = Object.keys(subscriptions).filter(subscription => {
            const subscriptionParts = subscription.split('/');
            const topicParts = topic.split('/');

            for (let i = 0; i < subscriptionParts.length; i++) {
                if (subscriptionParts[i] === '#') {
                    return true;
                }

                if (subscriptionParts[i] !== '+' && subscriptionParts[i] !== topicParts[i]) {
                    return false;
                }
            }
            return true;
        });

        validSubscriptions.forEach(subscription => {
            
            // console.log('SUUUUUUUUUUUUUUUUUUUUUB: ', subscriptions[subscription])
            Object.keys(subscriptions[subscription]).forEach(subscriptionId => {
                subscriptions[subscription][subscriptionId](parsedMessage, topic);
            });
        });
    }
});

export default app
