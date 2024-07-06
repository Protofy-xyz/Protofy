import {API} from 'protobase'

export const update = async (objectName: string, id, data: any, objects, options, cb?, errorCb?) => {
    const endPoint = objects[objectName].getApiEndPoint()
    let query = ""
    if(options && options.patch) {
        query = "?patch=true"
    }
    const result = await API.post(endPoint+'/' + id + query, data)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data)
    }
    return result
}