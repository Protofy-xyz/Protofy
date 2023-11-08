import notesPages from './notes/nextPages'
import databasePages from 'protolib/adminpanel/bundles/database/adminPages'
import devicePages from 'protolib/adminpanel/bundles/devices/adminPages'
import filesPages from 'protolib/adminpanel/bundles/files/adminPages'
import usersPages from 'protolib/adminpanel/bundles/users/adminPages'
import groupsPages from 'protolib/adminpanel/bundles/groups/adminPages'
import eventsPages from 'protolib/adminpanel/bundles/events/adminPages'
import objectsPages from 'protolib/adminpanel/bundles/objects/adminPages'
import tasksPages from 'protolib/adminpanel/bundles/tasks/adminPages'
import pagesPages from 'protolib/adminpanel/bundles/pages/adminPages'
import apisPages from 'protolib/adminpanel/bundles/apis/adminPages'
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