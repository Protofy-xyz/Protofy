import { useSubscription } from 'protolib'

export const useEvent = (eventFilter, topic = "#") => {
    const { message } = useSubscription('notifications/event/create/' + topic)
    
    if (message && message.message && eventFilter) {
        try {
            let content = JSON.parse(message.message as string)
            if (eventFilter.path && content['path'] != eventFilter.path) {
                return
            }
            if (eventFilter.from && content['from'] != eventFilter.from) {
                return
            }
            if (eventFilter.user && content['user'] != eventFilter.user) {
                return
            }
            if (!eventFilter.path && !eventFilter.from && !eventFilter.user && !eventFilter.all) {
                return
            }
            return message;
        } catch (e) {
            console.error('Error parsing message from mqtt: ', e)
        }
    }

    return message
}