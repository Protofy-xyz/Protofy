import { EventType } from "./eventsSchemas"
import {API} from 'protolib/base'

export const generateEvent = async (event: EventType, token='') => {
    try {
        await API.post('/adminapi/v1/events?token='+token, event)
    } catch(e) {
        //console.error("Failed to send event: ", e)
    }
}