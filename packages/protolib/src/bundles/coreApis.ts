import { ObjectsAPI } from './objects/objectsAPI'
import { WledAPI } from './wled/api/wledApi'
import { ResourcesAPI } from './resources/resourcesAPI'
import { MasksAPI } from './visualui/masksAPI';
import { ServicesAPI } from './services/servicesAPI'
import { TokensAPI } from './tokens/tokensAPI'
import { StateMachinesDefinitionsApi } from './stateMachines/stateMachineDefinitions/stateMachineDefinitionApi'
import { PackagesAPI } from './packages/packagesAPI'
import { MobileAPI } from './mobile/mobileAPI'
import { SequencesAPI } from './sequences/sequencesAPI'

export const AdminAPIBundles = (app, context) => {
  ObjectsAPI(app, context)
  WledAPI(app, context)
  ResourcesAPI(app, context)
  MasksAPI(app, context)
  ServicesAPI(app, context)
  TokensAPI(app, context)
  PackagesAPI(app, context)
  StateMachinesDefinitionsApi(app, context)
  MobileAPI(app, context)
  SequencesAPI(app, context)
}