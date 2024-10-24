import { clearSession } from 'protolib/lib/Session'

const logout = (setSession, setSessionContext) => {
    clearSession(setSession, setSessionContext)
}

export default [
    { label: "Profile", path: "/profile", visibility: session => session.loggedIn },
    {
        label: (workspace, session) => workspace.label,
        path: (workspace, session) => workspace.default,
        visibility: (session, workspace) => session.loggedIn && workspace && workspace.default && session.user?.admin,
        id: 'pop-over-admin-link'
    },
    {
        label: (workspace, session) => workspace.dev?.label,
        path: (workspace, session) => workspace.dev?.default,
        visibility: (session, workspace) => session.loggedIn && workspace && workspace.dev?.default && session.user?.admin &&  (!session.user?.environments || session.user?.environments.includes('dev') || session.user?.environments.includes('*')),
        id: 'pop-over-workspace-link'
    },
    { label: "Login", path: "/auth/login", visibility: session => !session.loggedIn },
    { label: "Logout", path: "/", visibility: session => session.loggedIn, onClick: logout },
]
