import { Cog, Inbox, Library, ToyBrick } from '@tamagui/lucide-icons'

export default {
    "default": "/workspace/events",
    "label": "Workspace",
    "menu": {
        "System": [
            { "name": "Users", "icon": "users", "type": "users", "path": "/" },
            { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
            // { "name": "Tasks", "icon": "zap", "type": "tasks", "path": "/" },
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "/?path=/apps/next/public" },
            { "name": "Files", "icon": "folder", "type": "files", "path": "/?path=packages/app/bundles/custom" },    
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
            { "name": "Resources", "icon": Library, "type": "resources", "path": "/"},
            { "name": "Databases", "icon": "database", "type": "databases", "path": "/"}
        ],
        "Devices":[
            { "name": "Devices", "icon": "serverConf", "type":"devices", "path": "/"},
            { "name": "Definitions", "icon": "bookOpen", "type":"deviceDefinitions", "path": "/"}
        ]
    }
}
