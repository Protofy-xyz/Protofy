import { StateMachinesAPI } from './stateMachines/stateMachines/stateMachinesApi'

import { ObjectUserAPI } from './objects/objectsUserAPI'
import { DevicesActions } from './devices/devices/devicesActions'
import { ObjectsActions } from './objects/objectsActions'

export const APIBundles = (app, context) => {
    StateMachinesAPI(app, context)
    ObjectUserAPI(app, context)
    DevicesActions(app, context)
    ObjectsActions(app, context)
}