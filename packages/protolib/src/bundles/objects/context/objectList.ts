import {API} from 'protobase'

export const list = async (objectName: string, page, itemsPerPage, objects, options, cb?, errorCb?) => {
    const endPoint = objects[objectName].getApiEndPoint()
    const result = await API.get(endPoint+'?page='+page+'&itemsPerPage='+itemsPerPage)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data.items, result.data.pages, result.data.total)
    }
    return result
}