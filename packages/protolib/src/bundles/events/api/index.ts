import { getServiceToken } from 'protonode'
import { generateEvent } from "../eventsLibrary"

export const onEvent = (mqtt, context, cb, path?, from?) => {
    context.topicSub(mqtt, 'notifications/event/create/#', (async (message: string, topic: string) => {
        try {
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

export const emitEvent = (path, from, user, payload, ephemeral = false) => {
    return generateEvent({
        path,
        from,
        user,
        payload,
        ephemeral
    }, getServiceToken())
}