import { StateMachinesDefinitionsApi } from './stateMachines/stateMachineDefinitions/stateMachineDefinitionApi'


export const AdminAPIBundles = (app, context) => {
  StateMachinesDefinitionsApi(app, context)
}