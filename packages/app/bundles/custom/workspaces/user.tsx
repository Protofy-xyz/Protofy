import { User, UserCog, Send } from '@tamagui/lucide-icons'

export default {
    "default": "/admin/profile",
    "label": "Settings",
    "menu": {
        "User": [
            { "name": "Profile", "icon": User, "type": "profile", "path": "/" },
            { "name": "Settings", "icon": UserCog, "type": "settings", "path": "/" },
        ]
    }
}
