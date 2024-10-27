import { useEffect } from "react"
import { useEvent } from "./useEvent"
import { API } from "protobase";
import { useSession } from "../../../lib/Session";

export const useFullEventEffect = (onEvent, eventFilter?: { path?: string, from?: string,user?:string }, initialEvent?: boolean) => {
    const event = useEvent(eventFilter)
    const [session] = useSession()

    const readEvent = async()=>{
        const userUrl = eventFilter.user? `&filter[user]=${eventFilter.user}`:""
        const pathUrl = eventFilter.path? `&filter[path]=${eventFilter.path}`: ""
        const from = eventFilter.from? `&filter[from]=${eventFilter.from}`: ""
        //x=1 is a dummy param to allow the use of the & operator in the url
        const urlLastEvent = `/api/core/v1/events?x=1${from}${userUrl}${pathUrl}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`

        let result = await API.get(urlLastEvent)
        if (result.isError) {
            console.error(result.error)
            return
        }
        const event = result.data?.items[0]

        if (!event) return

        event['message'] = JSON.stringify({ payload: result.data?.items[0]?.payload })
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
    }, [eventFilter.path])

}