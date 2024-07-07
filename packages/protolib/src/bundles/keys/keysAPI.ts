import { KeyModel } from "./";
import { AutoAPI } from 'protonode'


export const KeysAPI = AutoAPI({
    modelName: 'keys',
    modelType: KeyModel, 
    prefix: '/adminapi/v1/',
    dbName: 'keys',
    requiresAdmin: ['*']
})