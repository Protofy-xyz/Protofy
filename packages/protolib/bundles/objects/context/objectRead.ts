import {API} from '../../../base'

export const read = async (objectName: string, id: string, objects, options, cb?, errorCb?) => {
    const endPoint = objects[objectName].getApiEndPoint()
    const result = await API.get(endPoint+'/'+id)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}