import { API, getLogger, ProtoMemDB, generateEvent } from 'protobase';
import {getServiceToken} from 'protonode';
const logger = getLogger();

export const addAction = async (options: {
    chunk?: string,
    group?: string,
    tag: string,
    name: string,
    description?: string,
    method?: "get" | "post",
    params?: any,
    configParams?: any,
    url: string,
    emitEvent?: boolean,
    receiveBoard?: boolean,
    token?: string,
    responseKey?: string,
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const description = options.description || ''
    const params = options.params || {}
    const url = options.url
    const chunk = options.chunk || 'actions'
    const method = options.method || 'get'
    const receiveBoard = options.receiveBoard || false
    const responseKey = options.responseKey

    if(!name) {
        logger.error({}, "Action name is required");
        return
    }

    if(!tag) {
        logger.error({}, "Action tag is required");
        return
    }

    if(url === undefined) {
        logger.error({}, "Action url is required");
        return
    }

    const content = {
        description: description,
        params: params,
        ...(options.configParams && {configParams: options.configParams}),
        url: url,
        name: name,
        method: method,
        ...(receiveBoard && {receiveBoard: receiveBoard}),
        token: options.token || null,
        ...((responseKey !== undefined) && {responseKey: responseKey}),
    }
    
    if(options.token) {
        // console.log('-----------------------------------------------')
        // console.log('Setting value using api: ', value, 'for', group, tag, name)
        const result = await API.post(`/api/core/v1/protomemdb/${chunk}/${group}/${tag}/${name}?token=`+options.token, {value:content}) 
        // console.log('result: ', result)
        if(options.emitEvent) {
            generateEvent({
                path: `${chunk}/${group}/${tag}/${name}/update`, 
                from: "states",
                user: 'system',
                payload: content,
            }, getServiceToken())
        }
    } else {
        ProtoMemDB(chunk).set(group, tag, name, content)
        // console.log('setting locally', value, 'for', group, tag, name)
        if(options.emitEvent) {
            // console.log('emitting event in: '+`${chunk}/${group}/${tag}/${name}/update`)
            generateEvent({
                path: `${chunk}/${group}/${tag}/${name}/update`, 
                from: "states",
                user: 'system',
                payload: content,
            }, getServiceToken())
        }
    }
}