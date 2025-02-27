import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode'
const logger = getLogger();

export const getContext = async (options: {
    tag: string,
    name: string,
    defaultValue: any
}) => {
    const name = options.name
    const tag = options.tag
    const defaultValue = options.defaultValue

    if(!name) {
        logger.error({}, "State name is required");
        return
    }

    if(!tag) {
        logger.error({}, "State tag is required");
        return
    }

    if(!defaultValue) {
        logger.error({}, "State defaultValue is required");
        return
    }

    return ProtoMemDB.get(tag, name) ?? defaultValue
}