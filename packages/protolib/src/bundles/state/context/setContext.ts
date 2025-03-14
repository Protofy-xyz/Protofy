import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const setContext = async (options: {
    chunk?: string,
    group?: string,
    tag: string,
    name: string,
    value: any,
    emitEvent?: boolean,
    token?: boolean
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const value = options.value
    const chunk = options.chunk || 'states'

    if(!name) {
        logger.error({}, "State name is required");
        return
    }

    if(!tag) {
        logger.error({}, "State tag is required");
        return
    }

    if(value === undefined) {
        logger.error({}, "State value is required");
        return
    }

    if(options.token) {
        // console.log('Setting value using api: ', value, 'for', group, tag, name)
        const result = await API.post(`/api/v1/protomemdb/${chunk}/${group}/${tag}/${name}?token=`+options.token, {value: value}) 
        // console.log('result: ', result)
        if(options.emitEvent) {
            generateEvent({
                path: `${chunk}/${group}/${tag}/${name}/update`, 
                from: "states",
                user: 'system',
                payload:{value: value},
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
                payload:{value: value},
            }, getServiceToken())
        }
        return ProtoMemDB(chunk).set(group, tag, name, value)
    }
}