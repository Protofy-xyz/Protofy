import { useSubscription } from 'mqtt-react-hooks'

export const useEvent = ()=> {
    const { message } = useSubscription('notifications/event/create/#');
    return message
}