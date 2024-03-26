import { z } from 'protolib/base'
import { Router, Database, RefreshCcwDot, PencilRuler } from 'lucide-react'

export const apiTemplates = {
    "automatic-crud": {
        id: "automatic-crud",
        name: "Automatic CRUD",
        description: 'Generic API to create, read, update and delete.',
        icon: RefreshCcwDot,
        extraFields: (objects) => ({
            object: z.union([z.literal("without object"), ...(objects.data.items.map(o => z.literal(o.name)))] as any).after('name')
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('object')) {
                return { error: "object cant be empty" }
            }
            return
        }
    },
    "automatic-crud-storage": {
        id: "automatic-crud-storage",
        name: "Automatic CRUD (custom storage)",
        description: 'Generic API to create, read, update and delete with custom control.',
        icon: Database,
        extraFields: (objects) => ({
            object: z.union([z.literal("without object"), ...(objects.data.items.map(o => z.literal(o.name)))] as any).after('name')
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('object')) {
                return { error: "object cant be empty" }
            }
            return
        }
    },
    "iot-router": {
        id: "iot-router",
        name: "IOT Router",
        description: 'To control and obtain data with IoT devices.',
        icon: Router
    },
    "custom-api": {
        id: "custom-api",
        name: "Custom API",
        description: 'Create your API from scratch or import one from another project',
        icon: PencilRuler
    }
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