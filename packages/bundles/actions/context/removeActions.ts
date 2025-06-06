import { getLogger, ProtoMemDB } from 'protobase';
const logger = getLogger();

export const removeActions = async (options: {
    chunk?: string,
    group: string,
    tag: string
}) => {
    const chunk = options.chunk || 'actions'
    const group = options.group
    const tag = options.tag

    if(!group) {
        logger.error({}, "Action group is required");
        return
    }

    if(!tag) {
        logger.error({}, "Action tag is required");
        return
    }

    //removes all actions in the group and tag
    ProtoMemDB(chunk).clear(group, tag)
}