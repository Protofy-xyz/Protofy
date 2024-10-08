import { useFullEventEffect } from "./useFullEventEffect"

export const useEventEffect = (onEvent, eventFilter?: { path?: string, from?: string, user?: string }, initialEvent?: boolean) => {
    return useFullEventEffect((msg) => onEvent(msg.payload), eventFilter, initialEvent)
}