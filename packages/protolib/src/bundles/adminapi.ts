import { UsersAPI } from './users/usersAPI'
import { EventsAPI } from './events/eventsAPI'
import { GroupsAPI } from './groups/groupsAPI'
import { ObjectsAPI } from './objects/objectsAPI'
import { PagesAPI } from './pages/pagesAPI'
import { KeysAPI } from './keys/keysAPI'
import { APIsAPI } from './apis/api'
import { DevicesAPI } from './devices/devices/devicesAPI'
import { DeviceSdksAPI } from './devices/deviceSdks/deviceSdksAPI'
import { DeviceCoresAPI } from './devices/devicecores/devicecoresAPI'
import { DeviceBoardsAPI } from './devices/deviceBoards/deviceBoardsAPI'
import { DeviceDefinitionsAPI } from './devices/deviceDefinitions/deviceDefinitionsAPI'
import { DatabasesAPI } from './databases/databasesAPI'
import { WorkspacesAPI } from './workspaces/workspacesAPI'
import { ResourcesAPI } from './resources/resourcesAPI'
import { AiAssistantsAPI } from './aiAssistants/aiAssistantsAPI';
import { MasksAPI } from './visualui/masksAPI';
import { LogsAPI } from './logs/logsAPI'
import { ServicesAPI } from './services/servicesAPI'
import { FSMApi } from './fsm/FSMApi'
import { PackagesAPI } from './packages/packagesAPI'

export default (app, context) => {
  UsersAPI(app, context)
  GroupsAPI(app, context)
  EventsAPI(app, context)
  ObjectsAPI(app, context)
  KeysAPI(app, context)
  PagesAPI(app, context)
  APIsAPI(app, context)
  DevicesAPI(app, context)
  DeviceSdksAPI(app, context)
  DeviceCoresAPI(app, context)
  DeviceBoardsAPI(app, context)
  DeviceDefinitionsAPI(app, context)
  DatabasesAPI(app, context)
  WorkspacesAPI(app, context)
  ResourcesAPI(app, context)
  AiAssistantsAPI(app, context)
  MasksAPI(app, context)
  LogsAPI(app, context)
  ServicesAPI(app, context) 
  PackagesAPI(app, context)
  FSMApi(app, context)
}