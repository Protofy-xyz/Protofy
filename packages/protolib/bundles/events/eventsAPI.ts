import { EventModel } from ".";
import { AutoAPI, getDBOptions } from '../../api'
import {connectDB} from "app/bundles/storageProviders";

const EventAPI = AutoAPI({
    modelName: 'events',
    modelType: EventModel,
    prefix: '/adminapi/v1/',
    dbName: (action, req?, entityModel?:EventModel) => {
        if(req && req.query && req.query.env && (req.query.env == 'prod' || req.query.env == 'dev')) {
            return req.query.env + '/events'
        }

        if(entityModel) {
            const env = entityModel.getEnvironment()
            if(env != '*') {
                return env + '/events'
            }

            return [
                'dev/events',
                'prod/events'
            ]
        }

        return 'prod/events'
    },
    disableEvents: true,
    requiresAdmin: ['*'],
    itemsPerPage: 50,
    logLevel: "debug",
    defaultOrderBy: 'created',
    defaultOrderDirection: 'desc',
    skipDatabaseInitialization: true
})

export const EventsAPI = async (app, context) => {
    await connectDB('dev/events', {}, getDBOptions(EventModel, { batch: true }))
    await connectDB('prod/events', {}, getDBOptions(EventModel, { batch: true }))
    EventAPI(app, context)
}