import notesPages from './notes/nextPages'
import databasePages from 'protolib/bundles/database/adminPages'
import devicePages from 'protolib/bundles/devices/adminPages'
import filesPages from 'protolib/bundles/files/adminPages'
import usersPages from 'protolib/bundles/users/adminPages'
import groupsPages from 'protolib/bundles/groups/adminPages'
import eventsPages from 'protolib/bundles/events/adminPages'
import objectsPages from 'protolib/bundles/objects/adminPages'
import tasksPages from 'protolib/bundles/tasks/adminPages'
import pagesPages from 'protolib/bundles/pages/adminPages'
import apisPages from 'protolib/bundles/apis/adminPages'
import customPages from './custom/pages'

export default {
    ...notesPages,
    ...databasePages,
    ...devicePages,
    ...filesPages,
    ...usersPages,
    ...groupsPages,
    ...eventsPages,
    ...objectsPages,
    ...pagesPages,
    ...apisPages,
    ...tasksPages,
    ...customPages
}