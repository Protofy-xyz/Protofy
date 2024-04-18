import {Objects} from 'app/bundles/objects'
import {API} from 'protolib/base'

export const list = async (objectName: string, page, itemsPerPage, options, cb?, errorCb?) => {
    const endPoint = Objects[objectName].getApiEndPoint()
    const result = await API.get(endPoint+'?page='+page+'&itemsPerPage='+itemsPerPage)
    if(result.isError) {
        if(errorCb) errorCb(result.error)
    } else {
        if(cb) cb(result.data.items, result.data.pages, result.data.total)
    }
    return result
}