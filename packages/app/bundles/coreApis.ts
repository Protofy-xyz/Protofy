import ObjectsAPI from '@extensions/objects/coreApis'
import UsersAPI from '@extensions/users/coreApis'
import GroupsAPI from '@extensions/groups/coreApis'
import EventsAPI from '@extensions/events/coreApis'
import ProtoMemDBAPI from '@extensions/protomemdb/apis'
import PagesAPI from '@extensions/pages/coreApis'
import APIsAPI from '@extensions/apis/coreApis'
import ArduinosAPI from '@extensions/arduino/coreApis'
import AssetsAPI from '@extensions/assets/coreApis'
import AssistantAPI from '@extensions/assistant/coreApis'
import AutomationsAPI from '@extensions/automations/coreApis'
import BoardsAPI from '@extensions/boards/coreApis'
import CardsAPI from '@extensions/cards/coreApis'
import ChatbotsAPI from '@extensions/chatbots/coreApis'
import IconsAPI from '@extensions/icons/coreApis'
import DatabasesAPI from '@extensions/databases/coreApis'
import VisionAPI from '@extensions/vision/coreApis'
import WorkspacesAPI from '@extensions/workspaces/coreApis'
import KeysAPI from '@extensions/keys/coreApis'
import DeviceSdksAPI from '@extensions/devices/deviceSdks/coreApis'
import DeviceCoresAPI from '@extensions/devices/devicecores/coreApis'
import DeviceBoardsAPI from '@extensions/devices/deviceBoards/coreApis'
import DeviceDefinitionsAPI from '@extensions/devices/deviceDefinitions/coreApis'
import DevicesAPI from '@extensions/devices/devices/coreApis'
import LogsAPI from '@extensions/logs/coreApis'
import PackagesAPI from '@extensions/packages/coreApis'
import SequencesAPI from '@extensions/sequences/coreApis'
import ServicesAPI from '@extensions/services/coreApis'
import TokensAPI from '@extensions/tokens/coreApis'
import MasksAPI from '@extensions/visualui/coreApis'
import WledAPI from '@extensions/wled/api/coreApis'
import StateMachinesDefinitionsApi from '@extensions/stateMachines/stateMachineDefinitions/coreApis'

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