import { GroupModel } from "./";
import { AutoAPI } from '../../api'

export const GroupsAPI = AutoAPI({
    modelName: 'groups',
    modelType: GroupModel, 
    prefix: '/adminapi/v1/',
    dbName: 'auth_groups',
    requiresAdmin: ['create', 'update']
})