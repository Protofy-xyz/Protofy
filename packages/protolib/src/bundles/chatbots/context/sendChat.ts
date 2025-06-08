import { generateEvent } from 'protobase';
export const sendChat = async (token: string, to: string, message: string) => {
    return generateEvent({
        path: 'chat/notifications/' + to,
        from: 'chat',
        user: 'system',
        payload: {
            message
        }
    }, token)
}