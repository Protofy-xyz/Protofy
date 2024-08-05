import { atom, useAtom } from 'jotai'
import { atomWithStorage, useHydrateAtoms } from 'jotai/utils'
import * as cookie from 'cookie'
import { validateSession, SessionDataType, getSessionContext } from 'protonode/dist/lib/session'
import { NextPageContext } from 'next'
import { parse } from 'cookie'
import { getLogger, createSession } from "protobase"

const logger = getLogger()


export const SessionData = atomWithStorage("session", createSession(), undefined, {
    unstable_getOnInit: true
})

export const UserSettingsAtom = atomWithStorage("userSettings", {} as any)

export const Session = atom(
    (get) => get(SessionData),
    (get, set, data: SessionDataType) => {
        if (typeof window !== 'undefined') {
            //store a cookie
            document.cookie = "session=" + encodeURIComponent(JSON.stringify(data) ?? '') + ";path=/";
        }
        set(SessionData, data);
    }
);

const initialContext = { state: "pending", group: { workspaces: [] } }
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

export const getSessionCookie = async (cookieStr) => {
    const parsedCookies = cookie.parse(cookieStr ?? '');
    if (parsedCookies.session) {
        try {
            const data = JSON.parse(parsedCookies.session)
            const { iat, exp, ...validatedData } = await validateSession(data)
            return {
                ...data,
                user: {
                    ...data.user,
                    ...validatedData
                }
            } as SessionDataType
        } catch (error) {
            logger.error({ error }, "ERROR validating session")
            if (error == "Server Error") {
                throw "Server Error"
            }

        }
    }
    return undefined
}

//utility functions for nextjs pages
const fail = (returnUrl?) => {
    const encodedReturn = encodeURIComponent(returnUrl);
    return {
        redirect: {
            permanent: false,
            destination: "/auth/login" + (returnUrl ? "?return=" + encodedReturn : "")
        }
    }
}
export const withSession = async (context: any, permissions?: string[] | any[] | null, props?: any) => {
    let session;
    let sessionError;
    const hasSomePermission = (validPermissions, userPermissions) => {
        logger.trace({validPermissions, userPermissions}, "Checking permissions to access page");
        return validPermissions.some((perm) => userPermissions.includes(perm))
    }

    try {
        //try to get session. This can fail because of unavailable api
        //in case of error, let the client handle the session itself in CSR mode
        session = await getSessionCookie(context.req.headers.cookie)
    } catch (e) {
        sessionError = true
    }

    if (permissions && !sessionError) {
        if (!session) return fail(context.req.url)
        if (permissions.length && !session?.user?.admin && !hasSomePermission(permissions, session?.user?.permissions ?? [])) return fail()
    }

    const pageSession = { session: sessionError ? null : (session ?? createSession()), context: await getSessionContext(session?.user?.type) }
    return {
        props: {
            pageSession: pageSession,
            ...(typeof props === "function" ? await props() : props),
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
        session && settings[session.user.id] ? settings[session.user.id] : {},
        (val) => setSettings({ ...settings, [session.user.id]: val })
    ]
}

export const getURLWithToken = (url, context: NextPageContext) => {
    const { req } = context;
    const cookies = req.headers.cookie;

    let session;
    let __env = ''
    if (cookies) {
        try {
            const parsedCookies = parse(cookies);
            session = JSON.parse(parsedCookies.session);
            if (session.environment) {
                __env = '&__env=' + session.environment
            }
        } catch (e) {
            session = null
        }
    }

    const finalUrl = url + (session && session.token ? (url.includes('?') ? '&' : '?') + 'token=' + session.token + __env : '')
    logger.debug({ url: finalUrl }, "Return url with session token")
    return finalUrl
}
