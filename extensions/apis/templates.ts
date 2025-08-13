import { z } from 'protobase'
import { Router, Database, DatabaseZap, RefreshCcwDot, PencilRuler, MessageCircle, Sparkles, FunctionSquare, Shapes } from '@tamagui/lucide-icons'

export const apiTemplates = {
    "custom-api": {
        id: "custom-api-diagram",
        name: "Diagram + AI",
        description: 'Use visual diagrams and AI to create custom tasks to be used in your boards',
        icon: Shapes
    },
    "custom-api-code": {
        id: "custom-api",
        name: "Code + AI",
        description: 'Use code and AI to create custom tasks to be used in your boards',
        icon: PencilRuler
    }
    // "iot-router": {
    //     id: "iot-router",
    //     name: "IOT Router",
    //     description: 'Create automations to control IoT devices and react to IoT events',
    //     icon: Router
    // },
    // "automatic-crud": {
    //     id: "automatic-crud",
    //     name: "Object storage",
    //     description: 'Create automations to store and retrieve objects from database',
    //     icon: DatabaseZap,
    //     extraFields: (objects) => ({
    //         object: z.union([z.literal("without object"), ...(objects.data.items.map(o => z.literal(o.name)))] as any).after('name')
    //     }),
    //     extraValidation: (data) => {
    //         if (!Object.keys(data).includes('object')) {
    //             return { error: "object cant be empty" }
    //         }
    //         return
    //     }
    // },
    // "python-api": {
    //     id: "python-api",
    //     name: "Python API",
    //     description: 'Create python automations that react to events and perform actions (when ..., do ...)',
    //     icon: PencilRuler
    // },
    // "php": {
    //     id: "php",
    //     name: "Php script",
    //     description: 'Create php automations to perform actions',
    //     icon: FunctionSquare
    // },
    // "automatic-crud-storage": {
    //     id: "automatic-crud-storage",
    //     name: "Object storage (custom database)",
    //     description: 'Create automations to store and retrieve objects with custom database',
    //     icon: Database,
    //     extraFields: (objects) => ({
    //         object: z.union([z.literal("without object"), ...(objects.data.items.map(o => z.literal(o.name)))] as any).after('name')
    //     }),
    //     extraValidation: (data) => {
    //         if (!Object.keys(data).includes('object')) {
    //             return { error: "object cant be empty" }
    //         }
    //         return
    //     }
    // },
    // "automatic-crud-google-sheet": {
    //     id: "automatic-crud-google-sheet",
    //     name: "Object storage (Google Sheets)",
    //     description: 'Create automations to store and retrieve objects from Google Sheets',
    //     icon: RefreshCcwDot,
    //     extraFields: (objects) => ({
    //         object: z.union([z.literal("without object"), ...(objects.data.items.map(o => z.literal(o.name)))] as any).after('name'),
    //         param: z.string().label('Google Sheets Link').after('name').hint("https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit?usp=sharing"),
    //     }),
    //     extraValidation: (data) => {
    //         if (!Object.keys(data).includes('object')) {
    //             return { error: "object cant be empty" }
    //         }
    //         if (!Object.keys(data).includes('param')) {
    //             return { error: "spreadsheetId cant be empty" }
    //         }
    //         return
    //     }
    // }
}
