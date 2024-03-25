import { useEffect } from "react"
import { useEvent } from "./useEvent"

export const useEventEffect = (onEvent, eventFilter?: { path?: string, from?: string }) => {
    const event = useEvent(eventFilter)

    useEffect(() => {
        if (event) {
            onEvent(event)
        }
    }, [event])

}