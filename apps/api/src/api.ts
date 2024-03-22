import { app, getMQTTClient } from 'protolib/api'
import BundleAPI from 'app/bundles/apis'
import {getLogger, getApiUrl } from 'protolib/base';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { getPeripheralTopic } from 'protolib/bundles/devices/devices/devicesSchemas';
import { getBaseConfig, getConfigWithoutSecrets } from 'app/BaseConfig'
import { setConfig, getConfig } from 'protolib/base/Config';

const logger = getLogger()
//wait for mqtt before starting api server
const mqtt = getMQTTClient('api', getServiceToken(), () => {
    logger.debug({ config: getConfigWithoutSecrets(getConfig()) }, "Service Started: api")

    const topicSub = (topic, cb) => {
        mqtt.subscribe(topic)
        mqtt.on("message", (messageTopic, message) => {
            const isWildcard = topic.endsWith("#");
            if (!isWildcard && topic != messageTopic) {
                return
            }
            if (isWildcard && !messageTopic.startsWith(topic.slice(0, -1).replace(/\/$/, ''))) {
                return
            }
            const parsedMessage = message.toString();
            cb(parsedMessage, messageTopic)
        });
    };
    
    const topicPub = (topic, data) => {
        mqtt.publish(topic, data)
    }
    
    const deviceSub = async (deviceName, component, monitorName, cb) => {
        var data = null
        const SERVER = getApiUrl()
        try{
            const urlDevices = `${SERVER}/adminapi/v1/devices`
            const res = await fetch(urlDevices);
            data = await res.json();
        }catch(err){
            return;
        }
        const devices = data.items
        const device = devices.filter((e)=> {return e.name==deviceName})
        var endpoint = null;
        var type = null;
        if(device[0].subsystem){
            const subsystem = device[0].subsystem.filter((e)=>{return e.name == component})[0]
            console.log("subsystem: ", subsystem)
            const monitors = subsystem.monitors
            const monitor =monitors.filter((e)=>{return e.name == monitorName})[0]
            console.log("monitor: ", monitor)
            if(!monitor) return
            endpoint = monitor.endpoint
        }else{
            return;
        }
        if(!endpoint) return
        return topicSub(getPeripheralTopic(deviceName, endpoint), cb)
    }
    
    const devicePub = async (deviceName, component, componentName, payload?) => {
        var data = null;
        const SERVER = getApiUrl()
        try{
            const urlDevices = `${SERVER}/adminapi/v1/devices`
            const res = await fetch(urlDevices);
            data = await res.json();
        }catch(err){
            return;
        }
        const devices = data.items
        const device = devices.filter((e)=> {return e.name==deviceName})
        var endpoint = null;
        var type = null;
        var value = null;
        if(device[0].subsystem){
            const subsystem = device[0].subsystem.filter((e)=>{return e.name == component})[0]
            console.log("subsystem: ", subsystem)
            const actions = subsystem.actions
            const action =actions.filter((e)=>{return e.name == componentName})[0]
            console.log("action: ", action)
            if(!action) return
            endpoint = action.endpoint
            type = action.payload.type;
            value = action.payload.value
        }else{
            return;
        }
        if(!endpoint) return
        if(payload){
            topicPub(getPeripheralTopic(deviceName, endpoint),String(payload))
        }else{
            if(type == 'str'){
                topicPub(getPeripheralTopic(deviceName, endpoint),value)
            }
            if(type == 'json'){
                topicPub(getPeripheralTopic(deviceName, endpoint),JSON.stringify(value))
            }
        }
    }
    
    //wait for mqtt before starting API
    BundleAPI(app, { mqtt, devicePub, deviceSub, topicPub, topicSub })
})

export default app
