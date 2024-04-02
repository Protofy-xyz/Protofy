import { Cog, Inbox, Library, ToyBrick } from '@tamagui/lucide-icons'

export default {
    "default": "/admin/pages",
    "label": "Workspace",
    "menu": {
        "System": [
            { "name": "Users", "icon": "users", "type": "users", "path": "/" },
            { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "/?page=0&orderBy=created&orderDirection=desc" },
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
        ],
        "CMS": [
            { "name": "Files", "icon": "folder", "type": "files", "path": "/?path=packages/app/bundles/custom" },
            { "name": "Databases", "icon": "database", "type": "databases", "path": "/"},
            { "name": "Resources", "icon": Library, "type": "resources", "path": "/"},
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "/?path=/apps/next/public" },
        ],
        "IoT Devices":[
            { "name": "Devices", "icon": "serverConf", "type":"devices", "path": "/"},
            { "name": "Definitions", "icon": "bookOpen", "type":"deviceDefinitions", "path": "/"}
        ]
    }
}
