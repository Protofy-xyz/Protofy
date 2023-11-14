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
import { WorkspacesAPI } from 'protolib/bundles/workspaces/workspacesAPI'

export default (app, context) => {
  UsersAPI(app, context)
  GroupsAPI(app, context)
  EventsAPI(app, context)
  ObjectsAPI(app, context)
  PagesAPI(app, context)
  APIsAPI(app, context)
  DevicesAPI(app, context)
  DeviceSdksAPI(app, context)
  DeviceCoresAPI(app, context)
  DeviceBoardsAPI(app, context)
  DeviceDefinitionsAPI(app, context)
  TaskApi(app, context)
  DatabasesAPI(app, context)
  WorkspacesAPI(app, context)
}