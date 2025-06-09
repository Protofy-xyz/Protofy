import { UserModel } from "./";
import { AutoAPI, hash} from 'protonode'
import { addCard } from "@extensions/cards/context/addCard";

const UsersAutoAPI = AutoAPI({
    modelName: 'accounts',
    modelType: UserModel,
    prefix: '/api/core/v1/',
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

export const UsersAPI = (app, context) => {
    UsersAutoAPI(app, context)

    addCard({
        group: 'users',
        tag: "table",
        id: 'users_table',
        templateName: "Interactive users table",
        name: "users_table",
        defaults: {
            name: "Users Table",
            icon: "user-round",
            description: "Interactive users table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: `<iframe style=\"width: 100%;height:100%;\" src=\"/workspace/users?mode=embed\" />`, padding: '3px'\n});\n",
        },
        emitEvent: true
    })
}