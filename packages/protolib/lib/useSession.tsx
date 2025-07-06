import { atom, useAtom } from 'jotai'
import { atomWithStorage, useHydrateAtoms } from 'jotai/utils'
import { getLogger, createSession } from "protobase"
const initialContext = { state: "pending", group: { workspaces: [] } }
export const SessionContext = atom(initialContext)
export const UserSettingsAtom = atomWithStorage("userSettings", {} as any)
import {API } from 'protobase'

export const SessionData = atomWithStorage("session", createSession(), undefined, {
    unstable_getOnInit: true
})

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

export const getSessionContext = async (type) => {
    return { state: 'resolved', group: type ? (await API.get('/api/core/v1/groups/'+type)).data : {} }
}

export const initSession = (pageSession) => {
    if (pageSession) {
        useHydrateAtoms([
            [Session, pageSession.session],
            [SessionContext, pageSession.context]
        ]);
    }
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