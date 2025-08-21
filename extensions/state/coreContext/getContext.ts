import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode'
const logger = getLogger();

export const getContext = async (options: {
    chunk?: string
    group: string,
    tag: string,
    name: string,
    defaultValue: any
}) => {
    const name = options.name
    const group = options.group
    const tag = options.tag
    const defaultValue = options.defaultValue
    const chunk = options.chunk || 'states'

    if(!group) {
        logger.error({}, "State group is required");
        return
    }


    if(!tag) {
        logger.error({}, "State tag is required");
        return
    }

    if(name === undefined) {
        return ProtoMemDB(chunk).getByTag(group, tag) ?? defaultValue
    }
    return ProtoMemDB(chunk).get(group, tag, name) ?? defaultValue
}