import { API } from "protolib/base";
import { DevicesModel } from ".";
import { AutoAPI } from '../../../api'
import { getServiceToken } from "protolib/api/lib/serviceToken";
import { generateEvent } from "protolib/bundles/events/eventsLibrary";

export const DevicesAutoAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/'
})

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
        await generateEvent(
            {
                path: device, // == "devices"
                from: endpoint,
                user: deviceName,
                payload: {
                    message: message,
                    deviceName,
                    endpoint
                }
            },
            getServiceToken()
        );
    }))

    app.get('/adminapi/v1/notifications', async (req, res) => {
        const { data: events } = await API.get('/adminapi/v1/events?all=1&token=' + getServiceToken())
    })
}