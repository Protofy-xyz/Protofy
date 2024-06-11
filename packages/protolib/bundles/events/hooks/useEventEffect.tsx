import { useEffect } from "react"
import { useEvent } from "./useEvent"
import {API} from 'protolib'
import { useSession} from "protolib";


export const useEventEffect = (onEvent, eventFilter?: { path?: string, from?: string,user?:string }, initialEvent?: boolean) => {
    const event = useEvent(eventFilter)
    const [session] = useSession()

    const readEvent = async()=>{
        const userUrl = eventFilter.user? `&filter[user]=${eventFilter.user}`:""
        const pathUrl = eventFilter.path? `&filter[path]=${eventFilter.path}`: ""
        const from = eventFilter.from? `&filter[from]=${eventFilter.from}`: ""
        const env = "dev"
        const urlLastEvent = `/adminapi/v1/events?env=${env}${from}${userUrl}${pathUrl}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`

        let result = await API.get(urlLastEvent)
        if (result.isError) {
            console.error(result.error)
            return
        }
        const event = result.data?.items[0]?.payload
        event.message =  JSON.stringify({payload: result.data?.items[0]?.payload})
        onEvent(event)
    }

    useEffect(() => {
        if (event) {
            onEvent(event)
        }
    }, [event])

    useEffect(()=>{
        if(initialEvent){
            readEvent();
        }
    },[])

}