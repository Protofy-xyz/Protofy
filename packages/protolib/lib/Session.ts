import { atom, useAtom} from 'jotai';
import { atomWithStorage, useHydrateAtoms} from 'jotai/utils';
import * as cookie from 'cookie'
import { createSession, validateSession, SessionDataType, getSessionContext } from '../api/lib/session';
import { NextPageContext } from 'next'
import { parse } from 'cookie';

export const SessionData = atomWithStorage("session", createSession())
export const UserSettingsAtom = atomWithStorage("userSettings", {} as any )

export const Session = atom(
    (get) => get(SessionData), 
    (get, set, data: SessionDataType) => {
        if(typeof window !== 'undefined') {
            //store a cookie
            document.cookie = "session=" + encodeURIComponent(JSON.stringify(data) ?? '')+";path=/";
        }
        set(SessionData, data);
    }
);

const initialContext = {group: {workspaces:[]}}
export const SessionContext = atom(initialContext)

export const initSession = (pageSession) => {
    if (pageSession) {
        useHydrateAtoms([
            [Session, pageSession.session],
            [SessionContext, pageSession.context]
        ]);
    }
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
export const withSession = async (context:any, validTypes?:string[]|any[]|null, props?:any) => {
    const session = getSessionCookie(context.req.headers.cookie)

    if(validTypes) {
        if(!session) return fail(context.req.url)
        if(validTypes.length && !session?.user?.admin && !validTypes.includes(session?.user?.type ?? '')) return fail()
    }

    return { 
        props: { 
            pageSession:  {session: session ?? createSession(), context: await getSessionContext(session?.user?.type)},
            ...(typeof props === "function"? await props() : props),
        } 
    }
}

export const clearSession = (setSession, setSessionContext) => {
    setSession(createSession())
    setSessionContext(initialContext)
}

export const useSession = (pageSession?) => {
    initSession(pageSession)
    return useAtom(Session)
}

export const useSessionContext = () => {
    return useAtom(SessionContext)
}

export const useSessionGroup = () => {
    const [ctx] = useSessionContext()
    return ctx.group
}

export const useWorkspaces = () => {
    const group = useSessionGroup()
    if (group && group.workspaces) return group.workspaces
    return []
}

export const useUserSettings = () => {
    const [settings, setSettings] = useAtom(UserSettingsAtom)
    const [session] = useSession()
    return [
        session && settings[session.user.id] ? settings[session.user.id]: {},
        (val)=> setSettings({...settings, [session.user.id]:val})
    ]
}

export const getURLWithToken = (url, context:NextPageContext) => {
    const { req } = context;
    const cookies = req.headers.cookie;
  
    let session;
    let __env = ''
    if (cookies) {
      try {
        const parsedCookies = parse(cookies);
        session = JSON.parse(parsedCookies.session);
        if(session.environment) {
            __env = '&__env='+session.environment
        }
      } catch(e) {
        session = null
      }
    }
  
    const finalUrl = url + (session && session.token ? (url.includes('?') ? '&':'?')+'token='+session.token+__env : '')
    // console.log('final URL: ', finalUrl)
    return finalUrl
  }
