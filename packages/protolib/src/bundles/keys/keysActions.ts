import { KeyModel } from "./";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export const KeysActions = AutoActions({
    modelName: 'key',
    modelType: KeyModel,
    prefix, //where the API for the actions will be created
    pageSrc: '/workspace/keys?mode=embed', //what to display to the user in the list view
    apiUrl: '/api/core/v1/keys' //the URL to the API that will be used
})