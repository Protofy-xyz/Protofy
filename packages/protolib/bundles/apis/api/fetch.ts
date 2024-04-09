import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "protolib/base";

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