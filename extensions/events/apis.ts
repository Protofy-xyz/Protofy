import { EventModel } from 'protobase'
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'event',
    pluralName: 'events',
    modelType: EventModel,
    prefix, //where the API for the actions will be created
    object: 'events', //what to display to the user in the list view
    apiUrl: '/api/core/v1/events' //the URL to the API that will be used
})