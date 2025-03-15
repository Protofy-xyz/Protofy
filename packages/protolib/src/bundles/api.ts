import { StateMachinesAPI } from './stateMachines/stateMachines/stateMachinesApi'
import { PhpAPI } from './php/phpApi'
import { ProtoMemDBAPI } from './protomemdb/protomemdbAPI'

export const APIBundles = (app, context) => {
    ProtoMemDBAPI(app, context),
    StateMachinesAPI(app, context)
    PhpAPI(app, context)
}