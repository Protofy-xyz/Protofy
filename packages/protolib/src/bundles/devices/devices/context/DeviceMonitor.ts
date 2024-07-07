import { getServiceToken } from "protonode";
import { API } from "protobase";

export const deviceMonitor = async (device, subsystem, monitor) => {
    const url = `/adminapi/v1/devices/${device}/subsystems/${subsystem}/monitors/${monitor}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        throw result.error
    }
    return result.data?.value ?? result.data
}