import { UserModel } from "./";
import { AutoAPI, hash} from 'protonode'

const prefix = '/api/core/v1/'

const UsersAutoAPI = AutoAPI({
    modelName: 'accounts',
    modelType: UserModel,
    prefix,
    dbName: 'auth',
    transformers: {
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
    },
    requiresAdmin: ['*']
})

export default (app, context) => {
    UsersAutoAPI(app, context)
}