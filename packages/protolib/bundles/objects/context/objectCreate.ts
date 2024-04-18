import {Objects} from 'app/bundles/objects'
import {API} from 'protolib/base'

export const create = async (objectName: string, data: any, options, cb?, errorCb?) => {
    const endPoint = Objects[objectName].getApiEndPoint()
    const result = await API.post(endPoint, data)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}