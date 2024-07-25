import { API } from "protobase";
import { DevicesModel } from ".";
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { getDB } from '@my/config/dist/storageProviders';
import { generateEvent } from "../../events/eventsLibrary";
import { getLogger } from 'protobase';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

export const DevicesAutoAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    prefix: '/adminapi/v1/',
    skipDatabaseIndexes: true,
    useDatabaseEnvironment: false,
    useEventEnvironment: false
})

const logger = getLogger()


export const DevicesAPI = (app, context) => {
    const devicesPath = '../../data/devices/'
    const { topicSub, topicPub, mqtts } = context;
    DevicesAutoAPI(app, context)
    // Device topics: devices/[deviceName]/[endpoint], en caso de no tener endpoint: devices/[deviceName]
    /* examples
        devices/patata/switch/relay/actions/status
        devices/patata/button/relay/actions/status
        ...
    */
    app.get('/adminapi/v1/devices/:device/subsystems/:subsystem/actions/:action/:value', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB('devices')
        const deviceInfo = DevicesModel.load(JSON.parse(await db.get(req.params.device)), session)
        const env = deviceInfo.getEnvironment()
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

        topicPub(mqtts[env], action.getEndpoint(), req.params.value == "undefined" ? action.data.payload?.type == "json" ? JSON.stringify(action.getValue()) : action.getValue() : req.params.value)
        
        res.send({
            subsystem: req.params.subsystem,
            action: req.params.action,
            device: req.params.device,
            result: 'done'
        })
    }))

    app.get('/adminapi/v1/devices/:device/subsystems/:subsystem/monitors/:monitor', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB('devices')
        const deviceInfo = DevicesModel.load(JSON.parse(await db.get(req.params.device)), session)
        const env = deviceInfo.getEnvironment()
        const subsystem = deviceInfo.getSubsystem(req.params.subsystem)
        if(!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in device [${req.params.device}]`)
            return
        }

        const monitor = subsystem.getMonitor(req.params.monitor)
        if(!monitor) {
            res.status(404).send(`Monitor [${req.params.monitor}] not found in Subsytem [${req.params.subsystem}] for device [${req.params.device}]`)
            return
        }
        
        const urlLastDeviceEvent = `/adminapi/v1/events?env=${env}&filter[from]=device&filter[user]=${req.params.device}&filter[path]=${monitor.getEventPath()}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`
        const data = await API.get(urlLastDeviceEvent)

        if(!data || !data.data ||  !data.data['items'] || !data.data['items'].length) {
            res.status(404).send({value:null})
            return
        }
        res.send({value: data.data['items'][0]?.payload?.message})
    }))

    app.get('/adminapi/v1/devices/:device/yaml', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        const devicePath = path.join(devicesPath, req.params.device)
        if(!fs.existsSync(devicePath)){
            res.status(404).send({error: "Not Found"})
            return
        }
        const yaml = fs.readFileSync(path.join(devicePath,"config.yaml"),'utf8')
        res.send({yaml})
    }))

    app.post('/adminapi/v1/devices/:device/yamls', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const {yaml} = req.body

        
        if(!fs.existsSync(devicesPath)) fs.mkdirSync(devicesPath)
        const devicePath = path.join(devicesPath, req.params.device)
        if(!fs.existsSync(devicePath)) fs.mkdirSync(devicePath)

        fs.writeFileSync(path.join(devicePath,"config.yaml"),yaml)
        fs.writeFileSync(path.join(devicePath,"config_"+ moment().format("DD_MM_YYYY_HH_mm_ss")+".yaml"),yaml)

        res.send({value: yaml})
    }))

    const processMessage = async (env: string, message: string, topic: string) => {
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
                    environment: env,
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
    }

    topicSub(mqtts['dev'], 'devices/#', (message, topic) => processMessage('dev', message, topic))
    topicSub(mqtts['prod'], 'devices/#', (message, topic) => processMessage('prod', message, topic))
}