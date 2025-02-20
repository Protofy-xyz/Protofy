import { EventModel } from ".";
import { AutoAPI, getDBOptions, getServiceToken } from 'protonode'
import { connectDB, getDB } from '@my/config/dist/storageProviders';
import { API } from 'protobase'

export const EventsAPI = async (app, context) => {
    const EventAPI = AutoAPI({
        modelName: 'events',
        modelType: EventModel,
        prefix: '/api/core/v1/',
        onAfterCreate: async (data, session, req) => {
            const result = await API.get('/api/core/v1/events?itemsPerPage=1&orderBy=created&orderDirection=asc&token='+getServiceToken())
            // console.log("result", result)
            const maxEvents = process.env.MAX_EVENTS || 100000
            if(result.data){
                if(result.data.total >= maxEvents ){
                    const element = result.data.items[0]
                    // console.log("element", element)
                    const result2 = await API.get(`/api/core/v1/events/${element.id}/delete?token=${getServiceToken()}`)
                    // console.log("result2", result2)
                }
            }
            return data
        },
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
