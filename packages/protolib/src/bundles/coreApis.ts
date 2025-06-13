import { WledAPI } from './wled/api/wledApi'
import { MasksAPI } from './visualui/masksAPI';
import { StateMachinesDefinitionsApi } from './stateMachines/stateMachineDefinitions/stateMachineDefinitionApi'


export const AdminAPIBundles = (app, context) => {
  WledAPI(app, context)
  MasksAPI(app, context)
  StateMachinesDefinitionsApi(app, context)
}