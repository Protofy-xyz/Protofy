import { useEffect, useState } from "react"
import { getPendingResult } from "../base/PendingResult"
import { useUpdateEffect } from "usehooks-ts"
import { API } from "../base/Api"
import { usePendingEffect } from "./usePendingEffect"

export const useFileFromAPI = (path, json?):[any, any] => {
    const [fileContent, setFileContent] = useState(getPendingResult('pending'))

    useUpdateEffect(() => {
        setFileContent(getPendingResult('pending'))
    }, [path])

    usePendingEffect((s) => API.get('/adminapi/v1/files/'+path.replace(/\/+/g, '/'), s, true), setFileContent, fileContent, !json)
    return [fileContent, setFileContent]
}