import { Router, Inbox, Library, ToyBrick, Key, Cog, Database, DatabaseBackup, Package, Boxes, Box } from '@tamagui/lucide-icons'

export default ({pages}) => {
    const adminPages = pages.filter(p => p.pageType == 'admin' && p.object && p.route.startsWith('/workspace/'))

    return {
        "default": "/workspace/prod/services",
        "label": "Admin panel",
        "assistant": true,
        "logs": true,
        "dev": {
            "default": "/workspace/dev/services",
            "label": "Dev panel"
        },
        "menu": {
            ...(adminPages.length ? {"CMS": adminPages.map((page) => {
                return { "name": page.object.charAt(0).toUpperCase() + page.object.slice(1), "icon": Box, "type": page.route.split('/')[2], "path": page.route.split('/').slice(3), previewMode: page.status?.web == 'unpublished' }
            })}: {}),
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
                { "name": "Objects", "icon": Boxes, "type": "objects", "path": "/" },//"visibility": ["development"]
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
}
