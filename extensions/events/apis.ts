import { EventModel } from 'protobase'
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'event',
    modelType: EventModel,
    prefix, //where the API for the actions will be created
    pageSrc: '/workspace/events?mode=embed', //what to display to the user in the list view
    apiUrl: '/api/core/v1/events' //the URL to the API that will be used
})