import {API} from 'protobase'

export const create = async (objectName: string, data: any, objects, options, cb?, errorCb?) => {
    const endPoint = objects[objectName].getApiEndPoint()
    const result = await API.post(endPoint, data)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}