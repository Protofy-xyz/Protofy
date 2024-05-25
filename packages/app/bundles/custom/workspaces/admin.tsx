import { Router, Inbox, Library, ToyBrick, Key, Cog, Database, DatabaseBackup } from '@tamagui/lucide-icons'

export default {
    "default": "/workspace/prod/pages",
    "label": "Workspace",
    "dev": {
        "default": "/workspace/dev/pages",
        "label": "Workspace (Dev)"
    },
    "menu": {
        "System": [
            { "name": "Users", "icon": "users", "type": "users", "path": "/" },
            { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
            { "name": "Keys", "icon": Key, "type": "keys", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
            { "name": "Services", "icon": Cog, "type": "services", "path": "/"},
            { "name": "Databases", "icon": Database, "type": "databases", "path": "/system"},
        ],
        "Development": [
            { "name": "Objects", "icon": "box", "type": "objects", "path": "/" },//"visibility": ["development"]
            { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
            { "name": "Automations", "icon": ToyBrick, "type": "apis", "path": "/" },
        ],
        "Content": [
            { "name": "Files", "icon": "folder", "type": "files", "path": "?path=/" },
            { "name": "Resources", "icon": Library, "type": "resources", "path": "/"},
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "?path=/apps/next/public" },
            { "name": "Databases", "icon": DatabaseBackup, "type": "databases", "path": "/"},
        ],
        "IoT Devices":[
            { "name": "Devices", "icon": Router, "type":"devices", "path": "/"},
            { "name": "Definitions", "icon": "bookOpen", "type":"deviceDefinitions", "path": "/"}
        ]
    }
}
