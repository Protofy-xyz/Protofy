import { app, getMQTTClient } from 'protolib/api'
import BundleAPI from 'app/bundles/apis'
import {getLogger } from 'protolib/base';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
const logger = getLogger()
const mqtt = getMQTTClient('api', getServiceToken())

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
        cb(parsedMessage, topic)
    });
};

const topicPub = (topic, data) => {
    mqtt.publish(topic, data)
}

const deviceSub = (deviceName, component, componentName, cb) => {
    return topicSub(deviceName + '/' + component + '/' + componentName + '/state', cb)
}

const devicePub = async (deviceName, component, componentName) => {
    var data = null;
    try{
        const urlDevices = "http://localhost:8080/adminapi/v1/devices"
        const res = await fetch(urlDevices);
        data = await res.json();
    }catch(err){
        try{
            const urlDevices = "http://localhost:8000/adminapi/v1/devices"
            const res = await fetch(urlDevices);
            data = await res.json();
        }catch(err){
            return;
        }
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
    if(type == 'str'){
        topicPub(deviceName+endpoint,value)
    }
}



BundleAPI(app, { mqtt, devicePub, deviceSub, topicPub, topicSub })
export default app
