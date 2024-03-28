import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "protolib/base";

export const automation = (name,app,cb)=>{
    const url = "/api/v1/automations/"+name;
    app.get(url,(req,res)=>{
        cb(req.query)
        res.send("OK");
    })
}

export const fetch = async (method, url, key?, hasSarviceToken=false, data={})=>{
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
        throw result.error
    }

    return key? result.data[key] : result.data
}