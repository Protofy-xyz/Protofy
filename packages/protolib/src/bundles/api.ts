import { StateMachinesAPI } from './stateMachines/stateMachines/stateMachinesApi'
import { PhpAPI } from './php/phpApi'
import { ProtoMemDBAPI } from './protomemdb/protomemdbAPI'
import { ObjectUserAPI } from './objects/objectsUserAPI'

export const APIBundles = (app, context) => {
    ProtoMemDBAPI(app, context),
    StateMachinesAPI(app, context)
    PhpAPI(app, context)
    ObjectUserAPI(app, context)
}