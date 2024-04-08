import { GroupModel } from "./";
import { AutoAPI } from '../../api'

const initialData = {
    admin: {"name": "admin", "workspaces": ["admin", "editor"], "admin": true},
    editor: {"name": "editor", "workspaces": ["editor"], "admin": true},
    user: {"name": "user", "workspaces": []}
}

export const GroupsAPI = AutoAPI({
    modelName: 'groups',
    modelType: GroupModel, 
    initialData: initialData,
    prefix: '/adminapi/v1/',
    dbName: 'auth_groups',
    requiresAdmin: ['create', 'update']
})