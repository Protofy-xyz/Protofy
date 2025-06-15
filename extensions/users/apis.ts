import { UserModel } from ".";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'user',
    pluralName: 'users',
    modelType: UserModel,
    prefix, //where the API for the actions will be created
    pageSrc: '/workspace/users?mode=embed', //what to display to the user in the list view
    apiUrl: '/api/core/v1/accounts', //the URL to the API that will be used
    notificationsName: 'accounts'
})