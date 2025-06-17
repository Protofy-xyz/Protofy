import { ObjectModel } from "./";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export const ObjectsActions = AutoActions({
    modelName: 'object',
    pluralName: 'objects',
    modelType: ObjectModel,
    prefix, //where the API for the actions will be created
    object: 'objects', //what to display to the user in the list view
    apiUrl: '/api/core/v1/objects' //the URL to the API that will be used
})