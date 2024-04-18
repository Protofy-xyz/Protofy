import {Objects} from 'app/bundles/objects'
import {API} from 'protolib/base'

export const read = async (objectName: string, id: string, options, cb?, errorCb?) => {
    const endPoint = Objects[objectName].getApiEndPoint()
    const result = await API.get(endPoint+'/'+id)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}