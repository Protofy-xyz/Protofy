import {AdminAPIBundles} from 'protolib/bundles/coreApis'
import { UsersAPI } from '@extensions/users/usersAPI'
import { GroupsAPI } from '@extensions/groups/groupsAPI'
import { EventsAPI } from '@extensions/events/eventsAPI'
import { ProtoMemDBAPI } from '@extensions/protomemdb/protomemdbAPI'
import { PagesAPI } from '@extensions/pages/pagesAPI'
import { APIsAPI } from '@extensions/apis/api'
import { ArduinosAPI } from '@extensions/arduino/arduinosAPI'
import { AssetsAPI } from '@extensions/assets/assetsAPI'
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

export default (app, context) => {
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
  AdminAPIBundles(app, context)
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
}