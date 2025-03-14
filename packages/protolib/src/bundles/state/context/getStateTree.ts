import { API, getLogger, ProtoMemDB } from 'protobase';
import { generateEvent } from "../../events/eventsLibrary";
const logger = getLogger();

export const getStateTree = async (options: {
    token?: string
}) => {
    if(options?.token) {
        try {
            const result = await API.get(`/api/v1/protomemdb?token=`+options.token)
            return result.data
        } catch (error) {
            logger.error({}, "Error getting state tree: ", error)
            return
        }
    }
    return ProtoMemDB.getState()
}