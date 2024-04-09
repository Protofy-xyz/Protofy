import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "protolib/base";

export const deviceMonitor = async (device, subsystem, monitor) => {
    const url = `/adminapi/v1/devices/${device}/subsystems/${subsystem}/monitors/${monitor}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        throw result.error
    }
    return result.data
}