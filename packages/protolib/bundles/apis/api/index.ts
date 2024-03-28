import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "protolib/base";

export const automation = (name,app,cb)=>{
    const url = "/api/v1/automations/"+name;
    console.log("REGISTERING API: ", url )
    app.get(url,(req,res)=>{
        cb(req.query)
        res.send("OK");
    })
}

export const fetch = (method, url, data={}, hasSarviceToken=false)=>{
    var urlEnch = url
    if(hasSarviceToken) {
        urlEnch = url.includes("?")? `${url}&token=${getServiceToken()}`: `${url}?token=${getServiceToken()}`
    }
    switch(method) {
        case "get":
            return API.get(urlEnch)

        case "post":
            return API.post(urlEnch, data)
    }
}