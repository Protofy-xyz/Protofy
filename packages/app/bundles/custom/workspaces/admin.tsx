import { Router, Inbox, Library, ToyBrick, Key, Cog } from '@tamagui/lucide-icons'

export default {
    "default": "/workspace/pages",
    "label": "Workspace",
    "menu": {
        "System": [
            { "name": "Users", "icon": "users", "type": "users", "path": "/" },
            { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
            { "name": "Keys", "icon": Key, "type": "keys", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "?page=0&orderBy=created&orderDirection=desc" },
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
            { "name": "Services", "icon": Cog, "type": "services", "path": "/"},
        ],
        "Development": [
            { "name": "Objects", "icon": "box", "type": "objects", "path": "/" },
            { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
            { "name": "Automations", "icon": ToyBrick, "type": "apis", "path": "/" }, //"visibility": ["development"]
        ],
        "Content": [
            { "name": "Files", "icon": "folder", "type": "files", "path": "?path=/" },
            { "name": "Databases", "icon": "database", "type": "databases", "path": "/"},
            { "name": "Resources", "icon": Library, "type": "resources", "path": "/"},
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "?path=/apps/next/public" },
        ],
        "IoT Devices":[
            { "name": "Devices", "icon": Router, "type":"devices", "path": "/"},
            { "name": "Definitions", "icon": "bookOpen", "type":"deviceDefinitions", "path": "/"}
        ]
    }
}
