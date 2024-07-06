import jwt from 'jsonwebtoken';
import {API} from '../../base/Api'
import {userData, validatedUserData, SessionDataType} from '../../base/lib/perms'

export const getSessionContext = async (type) => {
    return { state: 'resolved', group: type ? (await API.get('/adminapi/v1/groups/'+type)).data : {} }
}

export const createSession = (data?:userData, token?:string):SessionDataType => {
    return {
        user: {
            admin: data?.admin ? data?.admin : false,
            id: data?.id ? data.id : 'guest',
            type: data?.id ? (data?.type ? data.type : 'user') : 'guest',
            permissions: data?.permissions ? data?.permissions : []
        },
        token: token ? token : '',
        loggedIn: data?.id ? true : false
    }
}
export const validateSession = async (session:SessionDataType):Promise<validatedUserData> => jwt.verify(session.token ?? '', process.env.TOKEN_SECRET ?? '') as validatedUserData
//DO NOT DELETE
//This is the code to validate sessions in api instead of nextjs
//This is needed to use a protofy from another protofy
//Its disabled because of unstability
// export const validateSession = async (session:SessionDataType):Promise<validatedUserData> => {
//     // console.log('VALIDATE SESSION: ', session)
//     const result = await API.get('/adminapi/v1/auth/validate?token='+session.token)
//     if(result.isError) {
//         throw "Server Error"
//     }
//     // console.log('VALIDTE: ', result)
//     if(!result.data.token) {
//         throw "Invalid session"
//     }  
//     return result.data as validatedUserData 
// }

export type {userData, validatedUserData, SessionDataType}
