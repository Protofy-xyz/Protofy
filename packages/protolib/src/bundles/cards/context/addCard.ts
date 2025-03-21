import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const addCard = async (options: {
    group?: string,
    tag: string,
    name: string,
    templateName: string,
    id: string,
    defaults: any,
    emitEvent?: boolean,
    token?: string
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const id = options.id
    const defaults = options.defaults
    const templateName = options.templateName

    if(!name) {
        logger.error({}, "Action name is required");
        return
    }

    if(!id) {
        logger.error({}, "Action id is required");
        return
    }

    if(!tag) {
        logger.error({}, "Action tag is required");
        return
    }

    if(!defaults) {
        logger.error({}, "Card defaults are required");
        return
    }

    if(!templateName) {
        logger.error({}, "Card templateName is required");
        return
    }

    const content = {
        defaults: defaults,
        name: templateName,
        id: id
    }

    if(options.token) {
        // console.log('-----------------------------------------------')
        // console.log('Setting value using api: ', value, 'for', group, tag, name)
        return await API.post(`/api/core/v1/cards/${group}/${tag}?token=`+options.token, {templateName, ...content}) 
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