import { getServiceToken } from 'protonode'
import { generateEvent } from "../eventsLibrary"
import { API } from "protobase";

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

export const getLastEvent = async (eventFilter?: { path?: string, from?: string, user?: string }) => {
    const token = getServiceToken()

    const userUrl = eventFilter.user ? `&filter[user]=${eventFilter.user}` : ""
    const pathUrl = eventFilter.path ? `&filter[path]=${eventFilter.path}` : ""
    const from = eventFilter.from ? `&filter[from]=${eventFilter.from}` : ""
    const env = process.env.NODE_ENV == 'development' ? 'dev' : 'prod'
    const urlLastEvent = `/api/core/v1/events?env=${env}${from}${userUrl}${pathUrl}&itemsPerPage=1&token=${token}&orderBy=created&orderDirection=desc`

    let result = await API.get(urlLastEvent)

    if (result.isError) {
        console.error(result.error)
        return
    }

    const event = result.data?.items[0]

    if (!event) return
    return event
}