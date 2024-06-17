import { z } from 'protolib/base'
import { Router, Database, DatabaseZap,RefreshCcwDot, PencilRuler } from 'lucide-react'

export const apiTemplates = {
    "custom-api": {
        id: "custom-api",
        name: "Automation",
        description: 'Create automations that react to events and perform actions (when ..., do ...)',
        icon: PencilRuler
    },
    "iot-router": {
        id: "iot-router",
        name: "IOT Router",
        description: 'Create automations to control IoT devices and react to IoT events',
        icon: Router
    },
    "automatic-crud": {
        id: "automatic-crud",
        name: "Object storage",
        description: 'Create automations to store and retrieve objects from database',
        icon: DatabaseZap,
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
        name: "Object storage (custom database)",
        description: 'Create automations to store and retrieve objects with custom database',
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
    "automatic-crud-google-sheet": {
        id: "automatic-crud-google-sheet",
        name: "Object storage (Google Sheets)",
        description: 'Create automations to store and retrieve objects from Google Sheets',
        icon: RefreshCcwDot,
        extraFields: (objects) => ({
            object: z.union([z.literal("without object"), ...(objects.data.items.map(o => z.literal(o.name)))] as any).after('name'),
            param: z.string().label('Google Sheets ID').after('name'),
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('object')) {
                return { error: "object cant be empty" }
            }
            if (!Object.keys(data).includes('param')) {
                return { error: "spreadsheetId cant be empty" }
            }
            return
        }
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