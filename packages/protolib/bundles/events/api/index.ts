import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { generateEvent } from "../eventsLibrary"

export const onEvent = (context, cb, path?, from?) => {
    context.topicSub('notifications/event/create/#', (async (msg: string, topic: string) => {
        try {
            const message = JSON.parse(msg)
            if (message) {
                if (path && message['path'] != path) {
                    return
                }
                if (from && message['from'] != from) {
                    return
                }
            }
            cb(message)
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