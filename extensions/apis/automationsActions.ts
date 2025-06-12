import { APIModel } from ".";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export const AutomationsActions = AutoActions({
    modelName: 'automation',
    modelType: APIModel,
    prefix, //where the API for the actions will be created
    pageSrc: '/workspace/apis?mode=embed', //what to display to the user in the list view
    apiUrl: '/api/core/v1/apis' //the URL to the API that will be used
})