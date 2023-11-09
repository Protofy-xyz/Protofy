import { UsersAPI } from 'protolib/bundles/users/usersAPI'
import { EventsAPI } from 'protolib/bundles/events/eventsAPI'
import { GroupsAPI } from 'protolib/bundles/groups/groupsAPI'
import { ObjectsAPI } from 'protolib/bundles/objects/objectsAPI'
import { PagesAPI } from 'protolib/bundles/pages/pagesAPI'
import { APIsAPI } from 'protolib/bundles/apis/api'
import { DevicesAPI } from 'protolib/bundles/devices/devices/devicesAPI'
import { DeviceSdksAPI } from 'protolib/bundles/devices/deviceSdks/deviceSdksAPI'
import { DeviceCoresAPI } from 'protolib/bundles/devices/devicecores/devicecoresAPI'
import { DeviceBoardsAPI } from 'protolib/bundles/devices/deviceBoards/deviceBoardsAPI'
import { DeviceDefinitionsAPI } from 'protolib/bundles/devices/deviceDefinitions/deviceDefinitionsAPI'
import { TaskApi } from 'protolib/bundles/tasks/api/taskApi'
import { DatabasesAPI } from 'protolib/bundles/databases/databasesAPI'

export default (app) => {
  UsersAPI(app)
  GroupsAPI(app)
  EventsAPI(app)
  ObjectsAPI(app)
  PagesAPI(app)
  APIsAPI(app)
  DevicesAPI(app)
  DeviceSdksAPI(app)
  DeviceCoresAPI(app)
  DeviceBoardsAPI(app)
  DeviceDefinitionsAPI(app)
  TaskApi(app)
  DatabasesAPI(app)
}