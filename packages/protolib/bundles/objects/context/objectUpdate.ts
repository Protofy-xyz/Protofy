import {Objects} from 'app/bundles/objects'
import {API} from 'protolib/base'

export const update = async (objectName: string, id, data: any, options, cb?, errorCb?) => {
    const endPoint = Objects[objectName].getApiEndPoint()
    const result = await API.post(endPoint+'/'+id, data)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}