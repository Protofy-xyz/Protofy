import {Objects} from 'app/bundles/objects'
import {API} from 'protolib/base'

export const deleteObject = async (objectName: string, id: string, options, cb?, errorCb?) => {
    const endPoint = Objects[objectName].getApiEndPoint()
    const result = await API.get(endPoint+'/'+id+'/delete')
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb()
    }
    return result
}