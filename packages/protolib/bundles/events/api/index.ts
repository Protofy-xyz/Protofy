export const onEvent = (context, cb, eventFilter?: { path?: string, from?: string }) => {
    context.topicSub('notifications/event/create/#', (async (msg: string, topic: string) => {
        try {
            const message = JSON.parse(msg)
            if (message && eventFilter) {
                if (eventFilter.path && message['path'] != eventFilter.path) {
                    return
                }
                if (eventFilter.from && message['from'] != eventFilter.from) {
                    return
                }
            }
            cb(message)
        } catch (e) {
            console.error('Error parsing message from mqtt: ', e)
        }
    }))
}