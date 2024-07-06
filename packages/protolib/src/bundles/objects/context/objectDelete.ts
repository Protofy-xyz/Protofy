import {API} from 'protobase'

export const deleteObject = async (objectName: string, id: string, objects, options, cb?, errorCb?) => {
    const endPoint = objects[objectName].getApiEndPoint()
    const result = await API.get(endPoint+'/'+id+'/delete')
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb()
    }
    return result
}