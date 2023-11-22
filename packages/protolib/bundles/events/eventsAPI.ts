import { EventModel } from ".";
import {AutoAPI, CreateApi} from '../../api'

export const EventsAPI = AutoAPI({
    modelName: 'events',
    modelType: EventModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    dbName: 'events',
    disableEvents: true,
    requiresAdmin: ['*']
})