import { useEffect, useRef, useState } from "react"
import { PendingResult, getPendingResult } from "../base/PendingResult"
import { useUpdateEffect } from "usehooks-ts"
import { API } from "../base/Api"
import { usePendingEffect } from "./usePendingEffect"

export const useFetch = (url, data?, plain?):[any, boolean, any] => {
    const [result, setResult] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>()
    const done = useRef(false)

    const _onDone = (result:PendingResult) => {
        if(result.isError) {
            setLoading(false)
            setError(result.error)
        } else if(result.isLoaded) {
            setLoading(false)
            setResult(result.data)
        }
    }

    if(!done.current) {
        setLoading(true)
        done.current = true
        if(!data) { // get
            API.get(url, _onDone, plain)
        } else{ // post
            API.post(url, data, _onDone, plain)
        }
    }


    return [result, loading, error]
}