import { PageModel } from ".";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'page',
    pluralName: 'pages',
    modelType: PageModel,
    prefix, //where the API for the actions will be created
    object: 'pages', //what to display to the user in the list view
    apiUrl: '/api/core/v1/pages' //the URL to the API that will be used
})