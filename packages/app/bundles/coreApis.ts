import ObjectsAPI from '@extensions/objects/coreApis'
import UsersAPI from '@extensions/users/coreApis'
import GroupsAPI from '@extensions/groups/coreApis'
import EventsAPI from '@extensions/events/coreApis'
import ProtoMemDBAPI from '@extensions/protomemdb/apis'
import PagesAPI from '@extensions/pages/coreApis'
import APIsAPI from '@extensions/apis/coreApis'
import ArduinosAPI from '@extensions/arduino/coreApis'
import AssetsAPI from '@extensions/assets/coreApis'
import { AssistantAPI } from '@extensions/assistant/assistantAPI'
import { AutomationsAPI } from '@extensions/automations/automationsAPI'
import { BoardsAPI } from '@extensions/boards/boardsAPI'
import { CardsAPI } from '@extensions/cards/cardsAPI'
import { ChatbotsAPI } from '@extensions/chatbots/chatbotsAPI'
import { IconsAPI } from '@extensions/icons/iconsAPI'
import { DatabasesAPI } from '@extensions/databases/databasesAPI'
import { VisionAPI } from '@extensions/vision/visionAPI'
import { WorkspacesAPI } from '@extensions/workspaces/workspacesAPI'
import { KeysAPI } from '@extensions/keys/keysAPI'
import { DeviceSdksAPI } from '@extensions/devices/deviceSdks/deviceSdksAPI'
import { DeviceCoresAPI } from '@extensions/devices/devicecores/devicecoresAPI'
import { DeviceBoardsAPI } from '@extensions/devices/deviceBoards/deviceBoardsAPI'
import { DeviceDefinitionsAPI } from '@extensions/devices/deviceDefinitions/deviceDefinitionsAPI'
import { DevicesAPI } from '@extensions/devices/devices/devicesAPI'
import { LogsAPI } from '@extensions/logs/logsAPI'
import { PackagesAPI } from '@extensions/packages/packagesAPI'
import { SequencesAPI } from '@extensions/sequences/sequencesAPI'
import { ServicesAPI } from '@extensions/services/servicesAPI'
import { TokensAPI } from '@extensions/tokens/tokensAPI'
import { MasksAPI } from '@extensions/visualui/masksAPI'
import { WledAPI } from '@extensions/wled/api/wledApi'
import { StateMachinesDefinitionsApi } from '@extensions/stateMachines/stateMachineDefinitions/stateMachineDefinitionApi'

export default (app, context) => {
  ObjectsAPI(app, context)
  KeysAPI(app, context)
  UsersAPI(app, context)
  GroupsAPI(app, context)
  EventsAPI(app, context)
  DevicesAPI(app, context)
  DeviceSdksAPI(app, context)
  DeviceCoresAPI(app, context)
  DeviceBoardsAPI(app, context)
  DeviceDefinitionsAPI(app, context)
  ProtoMemDBAPI(app, context, true)
  CardsAPI(app, context)
  PagesAPI(app, context)
  APIsAPI(app, context)
  ArduinosAPI(app, context)
  AssetsAPI(app, context)
  AssistantAPI(app, context)
  AutomationsAPI(app, context)
  BoardsAPI(app, context)
  ChatbotsAPI(app, context)
  IconsAPI(app, context)
  DatabasesAPI(app, context)
  VisionAPI(app, context)
  WorkspacesAPI(app, context)
  LogsAPI(app, context)
  PackagesAPI(app, context)
  SequencesAPI(app, context)
  ServicesAPI(app, context)
  TokensAPI(app, context)
  MasksAPI(app, context)
  WledAPI(app, context)
  StateMachinesDefinitionsApi(app, context)
}