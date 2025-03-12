import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const setContext = async (options: {
    group?: string,
    tag: string,
    name: string,
    value: any,
    emitEvent?: boolean
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const value = options.value

    if(!name) {
        logger.error({}, "State name is required");
        return
    }

    if(!tag) {
        logger.error({}, "State tag is required");
        return
    }

    if(!value) {
        logger.error({}, "State value is required");
        return
    }
    if(options.emitEvent) {
        generateEvent({
            path: `states/${group}/${tag}/${name}/update`, 
            from: "states",
            user: 'system',
            payload:{value: value},
        }, getServiceToken())
    }
    return ProtoMemDB.set(group, tag, name, value)
}