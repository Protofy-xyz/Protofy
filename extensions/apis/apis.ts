import { APIModel } from ".";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'automation',
    pluralName: 'automations',
    modelType: APIModel,
    prefix, //where the API for the actions will be created
    object: 'apis', //what to display to the user in the list view
    apiUrl: '/api/core/v1/apis' //the URL to the API that will be used
})