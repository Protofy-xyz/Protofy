export const requireAuth = (session: SessionDataType) => {
    if(!session || !session.loggedIn) {
        throw "E_AUTH"
    }
}

export const hasPermission = (session: SessionDataType, permission: string) => {
    requireAuth(session)
    if(!session.user.permissions || (!session.user.permissions.includes('*') && !session.user.permissions.includes(permission))) {
        throw "E_PERM"
    }
}

export type userData = {
    id?: string,
    type?: string
    admin?: boolean,
    permissions?: string[]
}

export type validatedUserData = userData & {
     iat:number,
     exp:number
}

export type SessionDataType = {
    environment?: any;
    user: userData,
    loggedIn: boolean,
    token?: string    
}