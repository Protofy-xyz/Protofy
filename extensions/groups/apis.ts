import { GroupModel } from "./";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'group',
    pluralName: 'groups',
    modelType: GroupModel,
    prefix, //where the API for the actions will be created
    pageSrc: '/workspace/groups?mode=embed', //what to display to the user in the list view
    apiUrl: '/api/core/v1/groups' //the URL to the API that will be used
})