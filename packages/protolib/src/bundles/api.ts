import { StateMachinesAPI } from './stateMachines/stateMachines/stateMachinesApi'
import { PhpAPI } from './php/phpApi'
import { ProtoMemDBAPI } from './protomemdb/protomemdbAPI'
import { BoardsAPI } from './boards/boardsAPI'

export const APIBundles = (app, context) => {
    StateMachinesAPI(app, context)
    PhpAPI(app, context)
    ProtoMemDBAPI(app, context),
    BoardsAPI(app, context)
}