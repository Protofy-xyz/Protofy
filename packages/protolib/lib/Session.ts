import { atom, useAtom} from 'jotai';
import { atomWithStorage, useHydrateAtoms} from 'jotai/utils';
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken';

export type userData = {
    id?: string,
    type?: string
}

export type validatedUserData = userData & {
     iat:number,
     exp:number
}

export type SessionData = {
    user: userData,
    loggedIn: boolean,
    token?: string    
}

export const createSession = (data?:userData, token?:string):SessionData => {
    return {
        user: {
            id: data?.id ? data.id : 'guest',
            type: data?.id ? (data?.type ? data.type : 'user') : 'guest'
        },
        token: token ? token : '',
        loggedIn: data?.id ? true : false
    }
}

export const SessionData = atomWithStorage("session", createSession())
export const Session = atom(
    (get) => get(SessionData), 
    (get, set, data: SessionData) => {
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

export const getSessionCookie = (cookieStr):SessionData | undefined => {
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
             } as SessionData
        } catch(e) {}
    }
    return undefined
}

export const validateSession = (session:SessionData):validatedUserData => jwt.verify(session.token ?? '', process.env.TOKEN_SECRET ?? '') as validatedUserData 

//utility functions for nextjs pages
const fail = (returnUrl?) => {
    return {
        redirect: {
            permanent: false,
            destination: "/auth/login"+(returnUrl?"?return="+returnUrl:"")
        }
    }
}
export const withSession = (context:any, validTypes?:[string], props?:any) => {
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

export const useSession = (pageSession) => {
    initSession(pageSession)
    return useAtom(Session)
}
