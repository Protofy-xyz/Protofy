import { genToken } from './crypt';

export const getServiceToken = () => {
    return genToken({id:'system', type: 'system', admin: true})
}

export const getDeviceToken = (deviceId,isAdmin:boolean=false) =>{
    return genToken({id: deviceId, type: 'device', admin: isAdmin},{expiresIn: '100y'})
}