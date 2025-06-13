import { API } from "protobase";

export const deviceAction = async (device, subsystem, action, value?) => {
    const url = `/api/core/v1/devices/${device}/subsystems/${subsystem}/actions/${action}/${value}`
    let result = await API.get(url)
    if (result.isError) {
        throw result.error
    }
    return result.data
}