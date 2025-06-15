import { ResourceModel } from "./";
import { AutoAPI } from 'protonode'

export default AutoAPI({
    modelName: 'resources',
    modelType: ResourceModel,
    prefix: '/api/v1/',
    dbName: 'resources',
    requiresAdmin: ['create', 'update']
})