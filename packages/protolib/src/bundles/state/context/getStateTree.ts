import { API, getLogger, ProtoMemDB } from 'protobase';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const getStateTree = async (options: {
    chunk?: string,
    token?: string
}) => {
    const chunk = options?.chunk || 'states'
    if(options?.token) {
        try {
            const result = await API.get(`/api/core/v1/protomemdb/${chunk}?token=`+options.token)
            return result.data
        } catch (error) {
            logger.error({}, "Error getting state tree: ", error)
            return
        }
    }
    return ProtoMemDB(chunk).getState()
}