import { atom, useAtom} from 'jotai';
import { atomWithStorage, useHydrateAtoms} from 'jotai/utils';
import * as cookie from 'cookie'
import { createSession, validateSession, SessionDataType } from '../api/lib/session';


export const SessionData = atomWithStorage("session", createSession())
export const Session = atom(
    (get) => get(SessionData), 
    (get, set, data: SessionDataType) => {
        if(typeof window !== 'undefined') {
            //store a cookie
            document.cookie = "session=" + encodeURIComponent(JSON.stringify(data) ?? '') + ";path=/";
        }
        set(SessionData, data);
    }
);

export const initSession = (pageSession) => {
    if (pageSession) useHydrateAtoms([[Session, pageSession]])
}

//to be used from nextJs
export const hasSessionCookie = (cookieStr) => {
    const parsedCookies = cookie.parse(cookieStr ?? '');
    return parsedCookies.session && JSON.parse(parsedCookies.session).loggedIn
}

export const getSessionCookie = (cookieStr):SessionDataType | undefined => {
    const parsedCookies = cookie.parse(cookieStr ?? '');
    if(parsedCookies.session) {
        try {
            const data = JSON.parse(parsedCookies.session)
            const {iat, exp, ...validatedData} = validateSession(data)
            return {
                ...data,
                user: {
                    ...data.user,
                    ...validatedData
                }
             } as SessionDataType
        } catch(e) {}
    }
    return undefined
}

//utility functions for nextjs pages
const fail = (returnUrl?) => {
    return {
        redirect: {
            permanent: false,
            destination: "/auth/login"+(returnUrl?"?return="+returnUrl:"")
        }
    }
}
export const withSession = (context:any, validTypes?:string[]|any[], props?:any) => {
    const session = getSessionCookie(context.req.headers.cookie)
    if(validTypes) {
        if(!session) return fail(context.req.url)
        if(validTypes.length && !validTypes.includes(session?.user?.type ?? '')) return fail()
    }
    

    return { 
        props: { 
            pageSession:  session ?? createSession(),
            ...(props??{})
        } 
    }
}

export const useSession = (pageSession?) => {
    initSession(pageSession)
    return useAtom(Session)
}
