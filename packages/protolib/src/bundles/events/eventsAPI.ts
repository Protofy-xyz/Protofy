import { EventModel } from ".";
import { AutoAPI, getDBOptions } from 'protonode'
import { connectDB, getDB } from '@my/config/dist/storageProviders';

export const EventsAPI = async (app, context) => {
    const EventAPI = AutoAPI({
        modelName: 'events',
        modelType: EventModel,
        prefix: '/api/core/v1/',
        skipStorage: async(data,session?,req?) => {
            if(data.ephemeral){
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
        skipDatabaseInitialization: true,
        dbOptions: {
            orderedInsert: true
        }
    })
    EventAPI(app, context)
}