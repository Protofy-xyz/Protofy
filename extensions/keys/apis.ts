import { KeyModel } from "./";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'key',
    pluralName: 'keys',
    modelType: KeyModel,
    prefix, //where the API for the actions will be created
    object: 'keys', //what to display to the user in the list view
    apiUrl: '/api/core/v1/keys' //the URL to the API that will be used
})