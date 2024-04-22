import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "protolib/base";
import {getLogger } from 'protolib/base';

const logger = getLogger()

export const automation = (app, cb, name)=>{
    const url = "/api/v1/automations/"+name;

    app.get(url,(req,res)=>{
        logger.info({name, params: req.query}, "Automation executed: "+name)
        cb(req.query)
        res.send('"OK"');
    })
}

export const fetch = async (method, url, data={}, cb, errorCb, hasSarviceToken=false)=>{
    var urlEnch = url
    if(hasSarviceToken) {
        urlEnch = url.includes("?")? `${url}&token=${getServiceToken()}`: `${url}?token=${getServiceToken()}`
    }
    
    let result
    if(method == "get") {
        result = await API.get(urlEnch)
    } else {
        result = await API.post(urlEnch, data)
    }

    if(result.isError) {
        if(errorCb) errorCb(result.error)
        throw result.error
    }

    if(cb) cb(result.data)
    return result.data
}

export const deviceMonitor = async (device, subsystem, monitor) => {
    const url = `/adminapi/v1/devices/${device}/subsystems/${subsystem}/monitors/${monitor}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        throw result.error
    }
    return result.data?.value ?? result.data
}

export {deviceAction} from './DeviceAction'