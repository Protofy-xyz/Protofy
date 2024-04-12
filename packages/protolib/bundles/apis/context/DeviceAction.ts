import { getServiceToken } from "protolib/api/lib/serviceToken";
import { API } from "protolib/base";

export const deviceAction = async (device, subsystem, action, value?) => {
    const url = `/adminapi/v1/devices/${device}/subsystems/${subsystem}/actions/${action}/${value}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        throw result.error
    }
    return result.data
}