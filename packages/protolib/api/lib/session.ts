import jwt from 'jsonwebtoken';
import {API} from '../../base/Api'

export const getSessionContext = async (type) => {
    return {group: type ? (await API.get('/adminapi/v1/groups/'+type)).data : {} }
}

export const createSession = (data?:userData, token?:string):SessionDataType => {
    return {
        user: {
            admin: data?.admin ? data?.admin : false,
            id: data?.id ? data.id : 'guest',
            type: data?.id ? (data?.type ? data.type : 'user') : 'guest'
        },
        token: token ? token : '',
        loggedIn: data?.id ? true : false
    }
}

export const validateSession = (session:SessionDataType):validatedUserData => jwt.verify(session.token ?? '', process.env.TOKEN_SECRET ?? '') as validatedUserData 

export type userData = {
    id?: string,
    type?: string
    admin?: boolean
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
