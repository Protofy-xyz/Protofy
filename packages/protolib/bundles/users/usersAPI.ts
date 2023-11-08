import { UserModel } from "./";
import {CreateApi, hash} from '../../api'

export const UsersAPI = CreateApi('accounts', UserModel, __dirname, '/adminapi/v1/', 'auth', {
    cypher: async (field, e, data) => {
        return {
            ...data,
            [field]: await hash(data[field])
        }
    },

    clearPassword: async(field, e, data) => {
        const {password, ...rest} = data
        return rest
    },
    
    update: async(field, e, data, prevData) => {
        if(!data.password) {
            data.password = prevData.password
        } else {
            data.password = await hash(data.password)
        }
        
        return data
    }
})