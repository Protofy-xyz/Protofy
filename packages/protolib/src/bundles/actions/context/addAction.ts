import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const addAction = async (options: {
    chunk?: string,
    group?: string,
    tag: string,
    name: string,
    description?: string,
    params?: any,
    url: string,
    emitEvent?: boolean,
    token?: string
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const description = options.description || ''
    const params = options.params || {}
    const url = options.url
    const chunk = options.chunk || 'actions'

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
        url: url,
        name: name
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
        return ProtoMemDB(chunk).set(group, tag, name, content)
    }
}