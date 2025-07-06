import { useEffect } from 'react'
import {useSession} from './useSession'

export function useIsAdmin(getFallbackUrl=() =>{}) {
    const [session] = useSession()

    useEffect(() => {
        if(!session || !session?.user?.admin) {
            const fallbackUrl = getFallbackUrl()
            //@ts-ignore
            window.location.href = fallbackUrl ?? '/workspace'
        }
    }, [session])
}