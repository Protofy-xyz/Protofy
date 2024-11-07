import { genToken } from './crypt';
var serviceToken = ''

export const getServiceToken = () => {
    if(!serviceToken) {
        serviceToken = genToken({id:'system', type: 'system', admin: true})
    }
    return serviceToken
}

export const getDeviceToken = (deviceId,isAdmin:boolean=false) =>{
    return genToken({id: deviceId, type: 'device', admin: isAdmin},{expiresIn: '100y'})
}