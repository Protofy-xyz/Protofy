import { API, getLogger, ProtoMemDB } from 'protobase';
import {getServiceToken} from 'protonode'
const logger = getLogger();

export const setContext = async (options: {
    tag: string,
    name: string,
    value: any
}) => {
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

    return ProtoMemDB.set(tag, name, value)
}