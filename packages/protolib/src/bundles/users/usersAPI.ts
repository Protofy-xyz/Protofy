import { UserModel } from "./";
import { AutoAPI, hash, AutoActions} from 'protonode'
import { addCard } from "@extensions/cards/context/addCard";

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


const UsersActions = AutoActions({
    modelName: 'users',
    modelType: UserModel,
    prefix,
    pageSrc: '/workspace/users?mode=embed'
})

export const UsersAPI = (app, context) => {
    UsersAutoAPI(app, context)
    UsersActions(app, context)
}