import { getServiceToken } from "protonode";
import { API } from "protobase";

export const wledAction = async (ipAdress, payload, cb?, errorCb?) => {

    const url = `/api/core/v1/wled/action/${ipAdress}?token=${getServiceToken()}`
    
    let result = await API.post(url, { payload })
    if (result.isError) {
        errorCb && errorCb()
        throw result.error
    }
    if (cb) cb(result.data)
    return result.data
}