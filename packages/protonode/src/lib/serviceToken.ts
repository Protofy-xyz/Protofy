import { genToken } from './crypt';
var serviceToken = ''

export const getServiceToken = () => {
    if(!serviceToken) {
        serviceToken = genToken({id:'system', type: 'system', admin: true})
    }
    return serviceToken
}