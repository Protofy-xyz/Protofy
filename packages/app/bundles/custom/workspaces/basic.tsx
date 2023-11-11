import { Cog, Send } from '@tamagui/lucide-icons'

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
            { "name": "Users", "icon": "users", "type": "users", "path": "/" },
            { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
            { "name": "Objects", "icon": "box", "type": "objects", "path": "/" },
            { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
            { "name": "Messages", "icon": Send, "type": "messages", "path": "/"},
            { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
            { "name": "Tasks", "icon": "zap", "type": "tasks", "path": "/" },
            { "name": "Public", "icon": "doorOpen", "type": "files", "path": "/apps/next/public" },
            { "name": "Files", "icon": "folder", "type": "files", "path": "/" },    
            { "name": "Databases", "icon": "database", "type": "databases", "path": "/"}
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
