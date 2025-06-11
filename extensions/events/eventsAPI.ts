import { AutoAPI, getDBOptions, getServiceToken } from 'protonode'
import { connectDB, getDB } from '@my/config/dist/storageProviders';
import { API, EventModel } from 'protobase'
import { addCard } from "@extensions/cards/context/addCard";

export const EventsAPI = async (app, context) => {
    const EventAPI = AutoAPI({
        modelName: 'events',
        modelType: EventModel,
        prefix: '/api/core/v1/',
        skipStorage: async (data, session?, req?) => {
            if (data.ephemeral) {
                return true
            }
            return false
        },
        dbName: 'events',
        notify: (entityModel, action) => {
            context.mqtt.publish(entityModel.getNotificationsTopic(action), entityModel.getNotificationsPayload())
        },
        disableEvents: true,
        requiresAdmin: ['*'],
        itemsPerPage: 50,
        logLevel: "trace",
        defaultOrderBy: 'created',
        defaultOrderDirection: 'desc',
        dbOptions: {
            orderedInsert: true,
            maxEntries: parseInt(process.env.MAX_EVENTS, 10) || 100000
        }
    })
    EventAPI(app, context)

    addCard({
        group: 'events',
        tag: "table",
        id: 'events_table',
        templateName: "Interactive events table",
        name: "events_table",
        defaults: {
            name: "Events Table",
            icon: "clipboard-list",
            description: "Interactive events table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: iframe({src:'/workspace/events?mode=embed'}), mode: 'slim'\n});\n",
        },
        emitEvent: true
    })
}
