import devicePages from 'protolib/bundles/devices/adminPages'
import filesPages from 'protolib/bundles/files/adminPages'
import usersPages from 'protolib/bundles/users/adminPages'
import groupsPages from 'protolib/bundles/groups/adminPages'
import eventsPages from 'protolib/bundles/events/adminPages'
import objectsPages from 'protolib/bundles/objects/adminPages'
import tasksPages from 'protolib/bundles/tasks/adminPages'
import messagesPages from 'protolib/bundles/messages/adminPages'
import pagesPages from 'protolib/bundles/pages/adminPages'
import apisPages from 'protolib/bundles/apis/adminPages'
import databasesPages from 'protolib/bundles/databases/adminPages'
import resourcesPages from 'protolib/bundles/resources/adminPages'

export default {
    ...devicePages,
    ...filesPages,
    ...usersPages,
    ...groupsPages,
    ...eventsPages,
    ...databasesPages,
    ...objectsPages,
    ...pagesPages,
    ...apisPages,
    ...tasksPages,
    ...messagesPages,
    ...resourcesPages
}