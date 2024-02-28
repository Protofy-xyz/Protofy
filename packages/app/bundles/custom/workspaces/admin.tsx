import { Cog, Inbox, Library, ToyBrick } from '@tamagui/lucide-icons'

export default {
    "default": "/admin/pages",
    "label": "Workspace",
    "menu": {
        "System": [
            { "name": "Users", "icon": "users", "type": "users", "path": "/" },
            { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
            // { "name": "Tasks", "icon": "zap", "type": "tasks", "path": "/" },
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
        ],
        "Development": [
            { "name": "Files", "icon": "folder", "type": "files", "path": "/?path=packages/app/bundles/custom" },
            { "name": "Objects", "icon": "box", "type": "objects", "path": "/" },
            { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
            { "name": "APIs", "icon": ToyBrick, "type": "apis", "path": "/" },
        ],
        "CMS": [
            { "name": "Databases", "icon": "database", "type": "databases", "path": "/"},
            { "name": "Resources", "icon": Library, "type": "resources", "path": "/"},
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "/?path=/apps/next/public" },
        ],
        "Devices":[
            { "name": "Devices", "icon": "serverConf", "type":"devices", "path": "/"},
            { "name": "Definitions", "icon": "bookOpen", "type":"deviceDefinitions", "path": "/"},
            { "name": "Boards", "icon": "board", "type":"deviceBoards", "path": "/"},
            { "name": "Cores", "icon": "cpu", "type":"deviceCores", "path": "/"}, 
            { "name": "Sdks", "icon": Cog, "type":"deviceSdks", "path": "/"}
        ]
    }
}
