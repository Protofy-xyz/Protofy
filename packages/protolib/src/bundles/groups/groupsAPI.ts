import { GroupModel } from "./";
import { AutoAPI } from 'protonode'
import { addCard } from "@extensions/cards/context/addCard";

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
    addCard({
        group: 'groups',
        tag: "table",
        id: 'groups_table',
        templateName: "Interactive groups table",
        name: "groups_table",
        defaults: {
            name: "Groups Table",
            icon: "users",
            description: "Interactive groups table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: iframe({src:'/workspace/groups?mode=embed'}), mode: 'slim'\n});\n",
        },
        emitEvent: true
    })
}