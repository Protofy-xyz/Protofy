import { GroupModel } from "./";
import {AutoAPI, CreateApi, hash} from '../../api'

export const GroupsAPI = AutoAPI({
    modelName: 'groups',
    modelType: GroupModel, 
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    dbName: 'auth_groups',
    requiresAdmin: ['create', 'update']
})