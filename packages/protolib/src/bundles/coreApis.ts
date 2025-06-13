import { WledAPI } from './wled/api/wledApi'
import { StateMachinesDefinitionsApi } from './stateMachines/stateMachineDefinitions/stateMachineDefinitionApi'


export const AdminAPIBundles = (app, context) => {
  WledAPI(app, context)
  StateMachinesDefinitionsApi(app, context)
}