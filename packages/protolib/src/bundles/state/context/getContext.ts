import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode'
const logger = getLogger();

export const getContext = async (options: {
    group: string,
    tag: string,
    name: string,
    defaultValue: any
}) => {
    const name = options.name
    const group = options.group
    const tag = options.tag
    const defaultValue = options.defaultValue

    if(!group) {
        logger.error({}, "State group is required");
        return
    }
    
    if(!name) {
        logger.error({}, "State name is required");
        return
    }

    if(!tag) {
        logger.error({}, "State tag is required");
        return
    }

    if(defaultValue === undefined) {
        logger.error({}, "State defaultValue is required");
        return
    }

    return ProtoMemDB.get(group, tag, name) ?? defaultValue
}