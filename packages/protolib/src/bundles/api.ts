import { StateMachinesAPI } from './stateMachines/stateMachines/stateMachinesApi'
import { PhpAPI } from './php/phpApi'
import { ObjectUserAPI } from './objects/objectsUserAPI'
import { ObjectsActions } from './objects/objectsActions'

export const APIBundles = (app, context) => {
    StateMachinesAPI(app, context)
    PhpAPI(app, context)
    ObjectUserAPI(app, context)
    ObjectsActions(app, context)
}