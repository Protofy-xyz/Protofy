import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const addCard = async (options: {
    group?: string,
    tag: string,
    name: string,
    description?: string,
    card: any,
    emitEvent?: boolean,
    token?: string
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const description = options.description || ''
    const card = options.card

    if(!name) {
        logger.error({}, "Action name is required");
        return
    }

    if(!tag) {
        logger.error({}, "Action tag is required");
        return
    }

    if(!card) {
        logger.error({}, "Card body is required");
        return
    }

    const content = {
        card: card,
        name: name,
        description: description,
    }

    if(options.token) {
        // console.log('-----------------------------------------------')
        // console.log('Setting value using api: ', value, 'for', group, tag, name)
        const result = await API.post(`/api/core/v1/protomemdb/cards/${group}/${tag}/${name}?token=`+options.token, {value:content}) 
        // console.log('result: ', result)
        if(options.emitEvent) {
            generateEvent({
                path: `cards/${group}/${tag}/${name}/update`, 
                from: "states",
                user: 'system',
                payload: content,
            }, getServiceToken())
        }
    } else {
        ProtoMemDB('cards').set(group, tag, name, content)
        // console.log('setting locally', value, 'for', group, tag, name)
        if(options.emitEvent) {
            // console.log('emitting event in: '+`${chunk}/${group}/${tag}/${name}/update`)
            generateEvent({
                path: `cards/${group}/${tag}/${name}/update`, 
                from: "states",
                user: 'system',
                payload: content,
            }, getServiceToken())
        }
    }
}