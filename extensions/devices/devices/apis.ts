import { DevicesModel } from "./";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'devices',
    modelType: DevicesModel,
    prefix, //where the API for the actions will be created
    pageSrc: '/workspace/devices?mode=embed', //what to display to the user in the list view
    apiUrl: '/api/core/v1/devices' //the URL to the API that will be used
})