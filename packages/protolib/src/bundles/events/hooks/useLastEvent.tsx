import { useState } from "react"
import { useFullEventEffect } from "./useFullEventEffect"

export const useLastEvent = (eventFilter?: { path?: string, from?: string, user?: string }) => {
    const [value, setValue] = useState()

    const onChange = (e) => {
        try {
            const value = JSON.parse(e.message)
            setValue(value)
        } catch (e) { }
    }
    
    useFullEventEffect(onChange, eventFilter, true)
    
    return value
}