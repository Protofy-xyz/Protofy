import { ResourceModel } from "./";
import {AutoAPI, CreateApi, hash} from '../../api'

export const ResourcesAPI = AutoAPI({
    modelName: 'resources',
    modelType: ResourceModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    dbName: 'resources',
    requiresAdmin: ['*']
})