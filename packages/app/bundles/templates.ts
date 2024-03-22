import { z } from 'protolib/base'

export const apiTemplates = {
    
}

export const pageTemplates = {
    "blank": {
        id: "blank",
        name: "Blank"
    },
    "default": {
        id: "default",
        name: "Default"
    },
    "admin": {
        name: "Admin panel",
        id: "admin",
        extraFields: (objects) => ({
            object: z.union([...(objects && objects.data ? objects.data?.items.filter(o => o.features && o.features['AutoAPI']).map(o => z.literal(o.name)) : [])] as any).after('route')
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('object')) {
                return { error: "object cant be empty" }
            }
            return
        }
    },
    "landing": {
        id: "landing",
        name: "Landing"
    },
    "iot": {
        id: "iot",
        name: "IoT Panel"
    },
    "ecomerce": {
        id: "ecomerce",
        name: "E-commerce"
    },
    "about": {
        id: "about",
        name: "About"
    },
    "newsfeed": {
        id: "newsfeed",
        name: "News feed"
    }
}