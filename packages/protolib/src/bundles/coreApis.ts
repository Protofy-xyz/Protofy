import { WledAPI } from './wled/api/wledApi'
import { ResourcesAPI } from './resources/resourcesAPI'
import { MasksAPI } from './visualui/masksAPI';
import { ServicesAPI } from './services/servicesAPI'
import { TokensAPI } from './tokens/tokensAPI'
import { StateMachinesDefinitionsApi } from './stateMachines/stateMachineDefinitions/stateMachineDefinitionApi'
import { SequencesAPI } from './sequences/sequencesAPI'

export const AdminAPIBundles = (app, context) => {
  WledAPI(app, context)
  ResourcesAPI(app, context)
  MasksAPI(app, context)
  ServicesAPI(app, context)
  TokensAPI(app, context)
  StateMachinesDefinitionsApi(app, context)
  SequencesAPI(app, context)
}