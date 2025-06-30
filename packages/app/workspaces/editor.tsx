import { Router, Inbox, Library, Key, Cog, Database, DatabaseBackup, Bot, HelpingHand } from '@tamagui/lucide-icons'

export default (pages) => {
    return {
        "default": "/workspace/pages",
        "label": "Workspace",
        "assistant": true,
        "logs": false,
        "menu": {
            "System": [
                { "name": "Users", "icon": "users", "href": "/workspace/users" },
                { "name": "Keys", "icon": Key, "href": "/workspace/keys" },
                { "name": "Events", "icon": "activity", "href": "/workspace/events" },
                { "name": "Messages", "icon": Inbox, "href": "/workspace/messages" },
                { "name": "Services", "icon": HelpingHand, "href": "/workspace/services" },
                { "name": "Databases", "icon": Database, "type": "databases", "path": "/system" },
                { "name": "Settings", "icon": Cog, "href": "/workspace/settings" }
            ],
            "Content": [
                { "name": "Files", "icon": "folder", "href": "/workspace/files?path=/" },
                { "name": "Resources", "icon": Library, "href": "/workspace/resources" },
                { "name": "Public", "icon": "door-open", "type": "/workspace/files?path=/apps/next/public"},
                { "name": "Databases", "icon": DatabaseBackup, "href": "/workspace/databases" },
            ],
            "Devices": [
                { "name": "Devices", "icon": Router, "href": "/workspace/devices" },
                { "name": "Definitions", "icon": "book-open", "href": "/workspace/deviceDefinitions" }
            ]
        }
    }
}
