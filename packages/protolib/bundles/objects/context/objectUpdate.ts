import {API} from 'protolib/base'

export const update = async (objectName: string, id, data: any, objects, options, cb?, errorCb?) => {
    const endPoint = objects[objectName].getApiEndPoint()
    const result = await API.post(endPoint+'/'+id, data)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}