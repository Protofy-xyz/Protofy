import { useEffect } from 'react'
import { useSession } from './useSession'

export function useIsLoggedIn(cb?: (session) => void) {
    const [session, setSession] = useSession()
    useEffect(() => {
        if (session.loggedIn) {
            if (cb) {
                cb(session)
            }
        }
    }, [session])
}