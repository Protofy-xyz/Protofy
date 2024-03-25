import { useEffect } from "react"
import { useEvent } from "./useEvent"

export const useEventEffect = (onEvent, eventFilter?: { path?: string, from?: string }) => {
    const event = useEvent()
    useEffect(() => {
        if (event && event.message) {
            try {
                let content = JSON.parse(event.message as string)
                if (eventFilter.path && content['path'] != eventFilter.path) {
                    return
                }
                if (eventFilter.from && content['from'] != eventFilter.from) {
                    return
                }
                onEvent(event)
            } catch (e) {
                console.error('Error parsing message from mqtt: ', e)
            }
        }
    }, [event])
}