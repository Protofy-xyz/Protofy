import { Cog, Inbox, Send } from '@tamagui/lucide-icons'

export default {
    "resources": [
        {
            "type": "template",
            "options": {
                "templates":["basicApi"],
                "paths": ["/apps/api/src/modules"]
            }
        }
    ],
    "menu": {
        "System": [
            { "name": "Objects", "icon": "box", "type": "objects", "path": "/" },
            { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
            { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
            { "name": "Tasks", "icon": "zap", "type": "tasks", "path": "/" },
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "/apps/next/public" },
            { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
        ]
    }
}
