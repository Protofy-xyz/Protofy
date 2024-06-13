import { useState } from "react"
import { useEventEffect } from "./useEventEffect"

export const useLastEvent = (eventFilter?: { path?: string, from?: string, user?: string }) => {
    const [value, setValue] = useState()

    const onChange = (e) => {
        try {
            const value = JSON.parse(e.message)
            setValue(value)
        } catch (e) { }
    }

    useEventEffect(onChange, eventFilter, true)

    return value
}