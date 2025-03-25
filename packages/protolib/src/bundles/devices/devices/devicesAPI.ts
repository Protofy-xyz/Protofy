import { API } from "protobase";
import { DevicesModel } from ".";
import { AutoAPI, handler, getServiceToken, getDeviceToken } from 'protonode'
import { getDB } from '@my/config/dist/storageProviders';
import { generateEvent } from "../../events/eventsLibrary";
import { getLogger } from 'protobase';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { addAction } from "../../actions/context/addAction";
import { addCard } from "../../cards/context/addCard";
import { downloadDeviceFirmwareEndpoint } from "../devicesUtils";

export const DevicesAutoAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    prefix: '/api/core/v1/',
    skipDatabaseIndexes: true,
    transformers:{
        generateDeviceCredentials: async (field, e, data) => {
            if(!data.credentials) data.credentials = {}
            data.credentials.mqtt = {username: data.name, password: getDeviceToken(data.name, false)}
            return data
        }

    }

})

const logger = getLogger()


export const DevicesAPI = (app, context) => {
    const devicesPath = '../../data/devices/'
    const { topicSub, topicPub, mqtt } = context;
    DevicesAutoAPI(app, context)
    // Device topics: devices/[deviceName]/[endpoint], en caso de no tener endpoint: devices/[deviceName]
    /* examples
        devices/patata/switch/relay/actions/status
        devices/patata/button/relay/actions/status
        ...
    */

    // iterate over all devices and register an action for each subsystem action
    const registerActions = async () => {
        const db = getDB('devices')
        //db.iterator is yeilding
        for await (const [key, value] of db.iterator()) {
            // console.log('device: ', value)
            const deviceInfo = DevicesModel.load(JSON.parse(value))
            for (const subsystem of deviceInfo.data.subsystem) {
                // console.log('subsystem: ', subsystem)
                if(subsystem.name == "mqtt") continue
                for (const monitor of subsystem.monitors ?? []) {
                    console.log('monitor: ', monitor)
                    if(subsystem.monitors.length == 1) {
                        addCard({
                            group: 'devices',
                            tag: deviceInfo.data.name,
                            id: 'devices_monitors_'+deviceInfo.data.name+'_'+subsystem.name,
                            templateName: deviceInfo.data.name + ' ' + subsystem.name+ ' device value',
                            name: subsystem.name,
                            defaults: {
                                name: deviceInfo.data.name + ' ' + subsystem.name,
                                description: monitor.description ?? "",
                                rulesCode: `return states['devices']['${deviceInfo.data.name}']['${subsystem.name}']`,
                                type: 'value'
                            },
                            emitEvent: true
                        })
                    } else{
                        addCard({
                            group: 'devices',
                            tag: deviceInfo.data.name,
                            id: 'devices_monitors_'+deviceInfo.data.name+'_'+monitor.name,
                            templateName: deviceInfo.data.name + ' ' + monitor.name + ' device value',
                            name: monitor.name,
                            defaults: {
                                name: deviceInfo.data.name + ' ' + monitor.name,
                                description: monitor.description ?? "",
                                rulesCode: `return states['devices']['${deviceInfo.data.name}']['${monitor.name}']`,
                                type: 'value'
                            },
                            emitEvent: true
                        })
                    }
                }
                const formatParamsJson = (json)=>{
                    const parts = Object.entries(json).map(([key, value]) => {
                        return `${key} ${value}`;
                      });
                    
                      if (parts.length === 0) {
                        return 'No constraints specified';
                      }
                    
                      return `The value must have ${parts.join(', ')}`;
                }

                for (const action of subsystem.actions ?? []) {
                    console.log("action::::::::: ", action)
                    const params = {value: "value to set"}
                    if(action.payload.type == "json-schema"){
                        delete params.value
                        Object.keys(action.payload.schema).forEach((key) => {
                            params[key] = formatParamsJson(action.payload.schema[key])
                        })
                    }
                    console.log("params: ", params)
                    addAction({
                        group: 'devices',
                        name: subsystem.name + '_' + action.name, //get last path element
                        url: `/api/core/v1/devices/${deviceInfo.data.name}/subsystems/${subsystem.name}/actions/${action.name}`,
                        tag: deviceInfo.data.name,
                        description: action.description ?? "",
                        ...!action.payload?.value ? {params}:{},
                        emitEvent: true
                    })

                    //http://localhost:8000/api/core/v1/cards to understand what this fills
                    addCard({
                        group: 'devices',
                        tag: deviceInfo.data.name,
                        id: 'devices_'+deviceInfo.data.name+'_'+subsystem.name + '_' + action.name,
                        templateName: deviceInfo.data.name + ' ' + subsystem.name + ' ' + action.name + ' device action',
                        name: subsystem.name + '_' + action.name,
                        defaults: {
                            name: deviceInfo.data.name + ' ' + subsystem.name + ' ' + action.name,
                            description: action.description ?? "",
                            rulesCode: `return execute_action('/api/core/v1/devices/${deviceInfo.data.name}/subsystems/${subsystem.name}/actions/${action.name}', userParams)`,
                            params: action.payload?.value ? {} : params,
                            type: 'action'
                        },
                        emitEvent: true
                    })
                }
            }
        }
    }

    registerActions()

    app.get('/api/core/v1/devices/:device/subsystems/:subsystem/actions/:action/:value?', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        console.log("action params: ",req.params)
        const value = req.params.value ?? req.query.value
        const db = getDB('devices')
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

        //console.log("action value: ",value == undefined ? action.data.payload?.type == "json" ? JSON.stringify(action.getValue()) : action.getValue() : value)
        topicPub(mqtt, action.getEndpoint(), value == undefined ? action.data.payload?.type == "json" ? JSON.stringify(action.getValue()) : action.getValue() : value)
        
        res.send({
            subsystem: req.params.subsystem,
            action: req.params.action,
            device: req.params.device,
            result: 'done'
        })
    }))

    app.get('/api/core/v1/devices/:device/subsystems/:subsystem/monitors/:monitor', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB('devices')
        const deviceInfo = DevicesModel.load(JSON.parse(await db.get(req.params.device)), session)
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
        
        //x=1 is a dummy param to allow the use of the & operator in the url
        const urlLastDeviceEvent = `/api/core/v1/events?x=1&filter[from]=device&filter[user]=${req.params.device}&filter[path]=${monitor.getEventPath()}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`
        const data = await API.get(urlLastDeviceEvent)

        if(!data || !data.data ||  !data.data['items'] || !data.data['items'].length) {
            res.status(404).send({value:null})
            return
        }
        res.send({value: data.data['items'][0]?.payload?.message})
    }))

    app.post('/api/core/v1/devices/:device/subsystems/:subsystem/monitors/:monitor/ephemeral', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB('devices')
        const deviceInfo = DevicesModel.load(JSON.parse(await db.get(req.params.device)), session)
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
        let {value} = req.body
        if(value == "true"  || value == true) {
            value = true;
        }else{
            value = false;
        }
        const device = deviceInfo.setMonitorEphemeral(req.params.subsystem, req.params.monitor, value)
        if(device){
            await db.put(device.getId(), JSON.stringify(device.serialize(true)))
        }
        res.send({value})
    }))

    app.get('/api/core/v1/devices/:device/yaml', handler(async (req, res, session) => {
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

    app.get('/api/core/v1/devices/:device/:compileSessionId/manifest', handler(async (req, res, session) => {
        const db = getDB('devices')
        const deviceInfo = DevicesModel.load(JSON.parse(await db.get(req.params.device)), session)
        const core = await deviceInfo.getCore()
        const mapCore = {
            "esp32": "ESP32",
            "esp8266": "ESP8266",
            "esp32s3": "ESP32-S3",
            "esp32c3": "ESP32-C3",
            "esp32s2": "ESP32-S2" 
        }
        const manifest = {
            "name": `${req.params.device} firmware`,
            "new_install_prompt_erase": true,
            "improv": true,
            "builds": [{
                "chipFamily": mapCore[core],
                "parts": [
                    {"path": downloadDeviceFirmwareEndpoint(req.params.device, req.params.compileSessionId), "offset": "0"},
                ]
            }]
            }
        res.send(JSON.stringify(manifest))
    }))

    app.post('/api/core/v1/devices/:device/yamls', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const {yaml} = req.body

        registerActions()

        if(!fs.existsSync(devicesPath)) fs.mkdirSync(devicesPath)
        const devicePath = path.join(devicesPath, req.params.device)
        if(!fs.existsSync(devicePath)) fs.mkdirSync(devicePath)
        fs.writeFileSync(path.join(devicePath,"config.yaml"),yaml)
        fs.writeFileSync(path.join(devicePath,"config_"+ moment().format("DD_MM_YYYY_HH_mm_ss")+".yaml"),yaml)

        res.send({value: yaml})
    }))

    const processMessage = async (message: string, topic: string) => {
        const splitted = topic.split("/");
        const device = splitted[0];
        const deviceName = splitted[1];
        const endpoint = splitted.slice(2).join("/")
        let parsedMessage = message;
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) { }
        if (endpoint == 'debug') {
            logger.trace({ from: device, deviceName, endpoint }, JSON.stringify({topic, message}))
        } else {
            const db = getDB('devices')
            const deviceInfo = DevicesModel.load(JSON.parse(await db.get(deviceName)))
            // console.log("deviceInfo: ", deviceInfo)
            // console.log("subsystems: ", deviceInfo.data.subsystem)
            // console.log("endpoint: ", endpoint)
            const monitor = deviceInfo.getMonitorByEndpoint("/"+endpoint)
            // console.log("monitor: ", monitor)
            if(!monitor){
                logger.trace({ from: device, deviceName, endpoint }, "Device not found: "+JSON.stringify({topic, message}))
                return
            }
            // const subsystem = deviceInfo.getSubsystem(req.params.subsystem)
            //TODO: replace endpoint.split('/')[1] with the subsystem name and use the monitor name inside the object value
            context.state.set({ group: 'devices', tag: deviceName, name: endpoint.split('/')[1], value: parsedMessage, emitEvent: true });
            generateEvent(
                {
                    ephemeral: monitor.data.ephemeral??false,
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

    topicSub(mqtt, 'devices/#', (message, topic) => processMessage(message, topic))
}