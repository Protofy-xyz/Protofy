import { ResourceModel } from "./";
import { AutoAPI } from 'protonode'

export const ResourcesAPI = AutoAPI({
    modelName: 'resources',
    modelType: ResourceModel,
    prefix: '/api/core/v1/',
    dbName: 'resources',
    requiresAdmin: ['create', 'update']
})