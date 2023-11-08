import { UsersAPI } from 'protolib/adminpanel/bundles/users/usersAPI'
import { EventsAPI } from 'protolib/adminpanel/bundles/events/eventsAPI'
import { GroupsAPI } from 'protolib/adminpanel/bundles/groups/groupsAPI'
import { ObjectsAPI } from 'protolib/adminpanel/bundles/objects/objectsAPI'
import { PagesAPI } from 'protolib/adminpanel/bundles/pages/pagesAPI'
import { APIsAPI } from 'protolib/adminpanel/bundles/apis/api'
import { DevicesAPI } from 'protolib/adminpanel/bundles/devices/devices/devicesAPI'
import { DeviceSdksAPI } from 'protolib/adminpanel/bundles/devices/deviceSdks/deviceSdksAPI'
import { DeviceCoresAPI } from 'protolib/adminpanel/bundles/devices/devicecores/devicecoresAPI'
import { DeviceBoardsAPI } from 'protolib/adminpanel/bundles/devices/deviceBoards/deviceBoardsAPI'
import { DeviceDefinitionsAPI } from 'protolib/adminpanel/bundles/devices/deviceDefinitions/deviceDefinitionsAPI'
import { TaskApi } from 'protolib/adminpanel/bundles/tasks/api/taskApi'

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
}