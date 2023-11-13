import { User, UserCog, Send } from '@tamagui/lucide-icons'

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
        "User": [
            { "name": "Profile", "icon": User, "type": "profile", "path": "/" },
            { "name": "Settings", "icon": UserCog, "type": "settings", "path": "/" },
        ]
    }
}
