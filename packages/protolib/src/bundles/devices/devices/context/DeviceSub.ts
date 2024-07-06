import { getPeripheralTopic } from '../devicesSchemas';
import { getApiUrl } from 'protobase';

export const deviceSub = async (mqtt, context, deviceName, component, monitorName, cb) => {
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
    const done = context.topicSub(mqtt, getPeripheralTopic(deviceName, endpoint), (message, topic) => {
        cb(message, topic, done)
    })
}