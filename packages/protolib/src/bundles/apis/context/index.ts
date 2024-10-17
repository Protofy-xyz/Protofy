import { getServiceToken as getServiceToken_} from 'protonode'
import { API, getLogger } from "protobase";

const logger = getLogger()

export const automationResponse = (res, data) => {
    res.send({result: data})
}

export const getServiceToken = (options?)=> {
    const done = options?.done || (()=>{})
    const token = getServiceToken_()
    done(token)
    return token
}

export const serviceToken = getServiceToken()

export const automation = (app, cb, name, disableAutoResponse?)=>{
    if(!name) {
        console.error("Automation name is required, doing nothing")
        return
    }

    if(!cb) {
        console.error("Automation callback is required, doing nothing")
        return
    }

    const url = "/api/v1/automations/"+name;

    app.get(url, async (req,res)=>{
        logger.info({name, params: req.query}, "Automation executed: "+name)
        try {
            await cb(req.query, res)
        } catch(err) {
            logger.error({name, params: req.query, error: err}, "Automation error: "+name)
            res.status(424).send({error: err.message})
        }

        if(!disableAutoResponse) {
            automationResponse(res, "Automation executed")
        }
    })
}

export const fetch = async (method, url, data={}, cb, errorCb, hasSarviceToken=false, retryNum?)=>{
    var urlEnch = url
    if(hasSarviceToken) {
        urlEnch = url.includes("?")? `${url}&token=${getServiceToken_()}`: `${url}?token=${getServiceToken_()}`
    }
    
    let result
    if(method == "get") {
        result = await API.get(urlEnch, undefined, undefined, retryNum)
    } else {
        result = await API.post(urlEnch, data, undefined, undefined, retryNum)
    }

    if(result.isError) {
        if(errorCb) errorCb(result.error)
        throw result.error
    }

    if(cb) cb(result.data)
    return result.data
}

export const executeAutomation = async (automation, cb, errorCb, hasSarviceToken=false, params= null)=>{
    return fetch("get", '/api/v1/automations/' + automation + (params?'?'+params:''), {}, cb, errorCb, hasSarviceToken)
}