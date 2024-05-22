import { EventModel } from ".";
import { AutoAPI } from '../../api'

const EventAPI = AutoAPI({
    modelName: 'events',
    modelType: EventModel,
    prefix: '/adminapi/v1/',
    dbName: 'events',
    disableEvents: true,
    requiresAdmin: ['*'],
    itemsPerPage: 50,
    logLevel: "debug",
    dbOptions: {
        batch: true
    },
    defaultOrderBy: 'created',
    defaultOrderDirection: 'desc'
})

export const EventsAPI = async (app, context) => {
    EventAPI(app, context)
}