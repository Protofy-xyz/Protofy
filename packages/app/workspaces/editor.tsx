import { Router, Inbox, Library, ToyBrick, Key, Cog, Database, DatabaseBackup, Bot } from '@tamagui/lucide-icons'

export default (pages) => {
    return {
        "default": "/workspace/pages",
        "label": "Workspace",
        "assistant": true,
        "logs": false,
        "menu": {
            "System": [
                { "name": "Users", "icon": "users", "href": "/workspace/users" },
                { "name": "Groups", "icon": "groups", "href": "/workspace/groups" },
                { "name": "Keys", "icon": Key, "href": "/workspace/keys" },
                { "name": "Events", "icon": "activity", "href": "/workspace/events" },
                { "name": "Messages", "icon": Inbox, "href": "/workspace/messages" },
                { "name": "Services", "icon": Cog, "href": "/workspace/services" },
                { "name": "Databases", "icon": Database, "type": "databases", "path": "/system" },
            ],
            "Content": [
                { "name": "Files", "icon": "folder", "href": "/workspace/files?path=/" },
                { "name": "Resources", "icon": Library, "href": "/workspace/resources" },
                { "name": "Public", "icon": "doorOpen", "type": "/workspace/files?path=/apps/next/public"},
                { "name": "Databases", "icon": DatabaseBackup, "href": "/workspace/databases" },
            ],
            "Fleets": [
                { "name": "Agents", "icon": Bot, "href": "/workspace/agents" },
                { "name": "Devices", "icon": Router, "href": "/workspace/devices" },
                { "name": "Definitions", "icon": "bookOpen", "href": "/workspace/deviceDefinitions" }
            ]
        }
    }
}
