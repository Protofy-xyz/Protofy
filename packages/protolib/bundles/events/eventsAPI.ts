import { EventModel } from ".";
import { AutoAPI, getDBOptions } from '../../api'
import {connectDB} from "app/bundles/storageProviders";



export const EventsAPI = async (app, context) => {
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
        notify: (entityModel, action) => {
            const env = entityModel.getEnvironment()
            if(env == '*') {
                Object.keys(context.mqtts).forEach((env) => {
                    context.mqtts[env].publish(entityModel.getNotificationsTopic(action), entityModel.getNotificationsPayload())
                })
            } else {
                context.mqtts[env == 'dev' ? 'dev' : 'prod'].publish(entityModel.getNotificationsTopic(action), entityModel.getNotificationsPayload())
            }
        },
        disableEvents: true,
        requiresAdmin: ['*'],
        itemsPerPage: 50,
        logLevel: "trace",
        defaultOrderBy: 'created',
        defaultOrderDirection: 'desc',
        skipDatabaseInitialization: true,
        dbOptions: {
            orderedInsert: true
        }
    })

    await connectDB('dev/events', {}, getDBOptions(EventModel, { orderedInsert: true }))
    await connectDB('prod/events', {}, getDBOptions(EventModel, { orderedInsert: true }))
    EventAPI(app, context)
}