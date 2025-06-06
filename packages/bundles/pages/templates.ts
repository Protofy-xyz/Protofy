import { z } from 'protobase'

export const pageTemplates = {
    "landing": {
        id: "landing",
        name: "Landing"
    },
    "admindashboard": {
        id: "admindashboard",
        name: "Admin Dashboard"
    },
    "adminagent": {
        name: "Control Panel",
        id: "adminagent",
        extraFields: () => ({
            agentName: z.string().label('Agent Name').after('route')
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('agentName')) {
                return { error: "Agent name can't be empty" }
            }
            return
        }
    },
    "admin": {
        name: "Object Management",
        id: "admin",
        extraFields: (objects) => ({
            object: z.union([...(objects && objects.data ? objects.data?.items.filter(o => o.features && o.features['AutoAPI']).map(o => z.literal(o.name)) : [])] as any).after('route')
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('object')) {
                return { error: "object can't be empty" }
            }
            return
        }
    },
    "adminblank": {
        id: "adminblank", 
        name: "Admin Empty" 
    },
    "dashboard": {
        id: "dashboard",
        name: "Dashboard"
    },
    "iot": {
        id: "iot",
        name: "IoT Panel"
    },
    "about": {
        id: "about",
        name: "About"
    },
    "blank": {
        id: "blank",
        name: "Blank"
    },
    "default": {
        id: "default",
        name: "Empty"
    },
}