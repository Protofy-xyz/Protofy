import { Cog, Inbox, Send } from '@tamagui/lucide-icons'

export default {
    "default": "/admin/events",
    "label": "Workspace",
    "menu": {
        "System": [
            { "name": "Objects", "icon": "box", "type": "objects", "path": "/" },
            { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
            { "name": "Tasks", "icon": "zap", "type": "tasks", "path": "/" },
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
        ]
    }
}
