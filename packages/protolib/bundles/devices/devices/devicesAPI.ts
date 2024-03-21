import { API } from "protolib/base";
import { DevicesModel } from ".";
import { AutoAPI } from '../../../api'
import { getServiceToken } from "protolib/api/lib/serviceToken";
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { getLogger } from 'protolib/base/logger';

export const DevicesAutoAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/'
})

const logger = getLogger()

export const DevicesAPI = (app, context) => {
    const { topicSub } = context;
    DevicesAutoAPI(app, context)
    // Device topics: devices/[deviceName]/[endpoint], en caso de no tener endpoint: devices/[deviceName]
    /* examples
        devices/patata/switch/relay/status
        devices/patata/button/relay/status
        ...
    */
    topicSub('devices/#', (async (message: string, topic: string) => {
        const splitted = topic.split("/");
        const device = splitted[0];
        const deviceName = splitted[1];
        const endpoint = splitted.slice(2).join("/")
        let parsedMessage = message;
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) { }
        if (endpoint == 'debug') {
            logger.debug({ from: device, deviceName, endpoint }, JSON.stringify({topic, message}))
        } else {
            await generateEvent(
                {
                    path: endpoint, 
                    from: "device",
                    user: deviceName,
                    payload: {
                        message: parsedMessage,
                        deviceName,
                        endpoint
                    }
                },
                getServiceToken()
            );
        }
    }))
}