import { useEffect, useState } from "react"
import { getPendingResult } from "protobase"
import { useUpdateEffect } from "usehooks-ts"
import { API } from "protobase"
import { usePendingEffect } from "./usePendingEffect"

export const useFileFromAPI = (path):[any, any] => {
    const [fileContent, setFileContent] = useState(getPendingResult('pending'))

    useUpdateEffect(() => {
        setFileContent(getPendingResult('pending'))
    }, [path])

    usePendingEffect((s) => API.get('/api/core/v1/files/'+path.replace(/\/+/g, '/'), s, true), setFileContent, fileContent)
    return [fileContent, setFileContent]
}