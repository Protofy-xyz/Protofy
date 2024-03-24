import { useEffect, useState } from "react"
import { PendingResult, getPendingResult } from "../base/PendingResult"
import { useUpdateEffect } from "usehooks-ts"
import { API } from "../base/Api"
import { usePendingEffect } from "./usePendingEffect"

export const useFetch = (url, data?):[any, boolean, any] => {
    const [result, setResult] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>()

    const _onDone = (result:PendingResult) => {
        if(result.isError) {
            setLoading(false)
            setError(result.error)
        } else if(result.isLoaded) {
            setLoading(false)
            setResult(result.data)
        }
    }

    if(!data) { // get
        API.get(url, _onDone)
    } else{ // post
        API.post(url, data, _onDone)
    }

    return [result, loading, error]
}