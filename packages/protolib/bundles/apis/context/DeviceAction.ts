import { getServiceToken } from "protolib/api/lib/serviceToken";
import { API } from "protolib/base";

export const deviceAction = async (device, subsystem, action, value?, cb?, errorCb?) => {
    const url = `/adminapi/v1/devices/${device}/subsystems/${subsystem}/actions/${action}/${value}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        errorCb && errorCb()
        throw result.error
    }
    if (cb) cb(result.data)
    return result.data
}