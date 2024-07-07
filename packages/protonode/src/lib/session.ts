import jwt from 'jsonwebtoken';
import {userData, validatedUserData, SessionDataType, API} from 'protobase'

export const getSessionContext = async (type) => {
    return { state: 'resolved', group: type ? (await API.get('/adminapi/v1/groups/'+type)).data : {} }
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
