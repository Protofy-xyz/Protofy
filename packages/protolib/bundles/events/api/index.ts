import { getServiceToken } from '../../../api/lib/serviceToken'
import { generateEvent } from "../eventsLibrary"

export const onEvent = (context, cb, path?, from?) => {
    context.topicSub('notifications/event/create/#', (async (msg: string, topic: string) => {
        try {
            if (msg) {
                if (path && msg['path'] != path) {
                    return
                }
                if (from && msg['from'] != from) {
                    return
                }
            }
            cb(msg)
        } catch (e) {
            console.error('Error parsing message from mqtt: ', e)
        }
    }))
}

export const emitEvent = (path, from, user, payload) => {
    return generateEvent({
        path,
        from,
        user,
        payload
    }, getServiceToken())
}