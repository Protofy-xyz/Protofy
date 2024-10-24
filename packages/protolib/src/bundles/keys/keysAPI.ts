import { KeyModel } from "./";
import { AutoAPI } from 'protonode'


export const KeysAPI = AutoAPI({
    modelName: 'keys',
    modelType: KeyModel, 
    prefix: '/api/core/v1/',
    dbName: 'keys',
    requiresAdmin: ['*']
})