import { GroupModel } from "./";
import { AutoAPI } from 'protonode'

const initialData = {
    admin: {"name": "admin", "workspaces": ["admin", "editor"], "admin": true},
    editor: {"name": "editor", "workspaces": ["editor"], "admin": true},
    user: {"name": "user", "workspaces": []}
}

const GroupsAutoAPI = AutoAPI({
    modelName: 'groups',
    modelType: GroupModel, 
    initialData: initialData,
    prefix: '/api/core/v1/',
    dbName: 'auth_groups',
    requiresAdmin: ['create', 'update']
})

export const GroupsAPI = (app, context) => {
    GroupsAutoAPI(app, context)
}