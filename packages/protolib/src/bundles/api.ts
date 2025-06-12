import { StateMachinesAPI } from './stateMachines/stateMachines/stateMachinesApi'
import { PhpAPI } from './php/phpApi'
import { ObjectUserAPI } from './objects/objectsUserAPI'
import { UsersActions } from './users/usersActions'
import { DevicesActions } from './devices/devices/devicesActions'

export const APIBundles = (app, context) => {
    StateMachinesAPI(app, context)
    PhpAPI(app, context)
    ObjectUserAPI(app, context)
    UsersActions(app, context)
    DevicesActions(app, context)
}