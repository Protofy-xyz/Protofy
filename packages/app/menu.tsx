import { clearSession } from 'protolib/lib/Session'

const logout = (setSession, setSessionContext) => {
    clearSession(setSession, setSessionContext)
}

export default [
    { label: "Profile", path: "/profile", visibility: session => session.loggedIn },
    {
        label: (workspace, session) => workspace.label,
        path: (workspace, session) => workspace.default,
        visibility: (session, workspace) => {
            return session.loggedIn && workspace && workspace.default && session.user?.admin
        },
        id: 'pop-over-workspace-link'
    },
    { label: "Login", path: "/auth/login", visibility: session => !session.loggedIn },
    { label: "Logout", path: "/", visibility: session => session.loggedIn, onClick: logout },
]
