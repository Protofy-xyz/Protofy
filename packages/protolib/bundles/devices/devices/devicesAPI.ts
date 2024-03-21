import { API } from "protolib/base";
import { DevicesModel } from ".";
import { connectDB, getDB, AutoAPI, handler } from '../../../api'
import { getServiceToken } from "protolib/api/lib/serviceToken";
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { getLogger } from 'protolib/base/logger';
import { getInitialData } from 'app/initialData';

export const DevicesAutoAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/'
})

const logger = getLogger()

export const DevicesAPI = (app, context) => {
    const { topicSub, topicPub } = context;
    DevicesAutoAPI(app, context)
    // Device topics: devices/[deviceName]/[endpoint], en caso de no tener endpoint: devices/[deviceName]
    /* examples
        devices/patata/switch/relay/status
        devices/patata/button/relay/status
        ...
    */
    app.get('/adminapi/v1/devices/:device/:subsystem/:action', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        const db = getDB('../../data/databases/devices')
        const deviceInfo = DevicesModel.load(JSON.parse(await db.get(req.params.device)), session)
        const subsystem = deviceInfo.getSubsystem(req.params.subsystem)
        if(!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in device [${req.params.device}]`)
            return
        }
        
        const action = subsystem.getAction(req.params.action)
        if(!action) {
            res.status(404).send(`Action [${req.params.action}] not found in Subsytem [${req.params.subsystem}] for device [${req.params.device}]`)
            return
        }
        topicPub(action.getEndpoint(), action.getValue())
        res.send({
            subsystem: req.params.subsystem,
            action: req.params.action,
            device: req.params.device,
            result: 'done'
        })
    }))

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