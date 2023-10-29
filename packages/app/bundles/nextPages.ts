import notesPages from './notes/nextPages'
import databasePages from 'protolib/adminpanel/bundles/database/adminPages'
import devicePages from 'protolib/adminpanel/bundles/devices/adminPages'
import filesPages from 'protolib/adminpanel/bundles/files/adminPages'
import usersPages from 'protolib/adminpanel/bundles/users/adminPages'
import groupsPages from 'protolib/adminpanel/bundles/groups/adminPages'
import eventsPages from 'protolib/adminpanel/bundles/events/adminPages'
import automationPages from 'protolib/adminpanel/bundles/automation/adminPages'
import objectsPages from 'protolib/adminpanel/bundles/objects/adminPages'


export default {
    ...notesPages,
    ...databasePages,
    ...devicePages,
    ...filesPages,
    ...usersPages,
    ...groupsPages,
    ...eventsPages,
    ...automationPages,
    ...objectsPages
}