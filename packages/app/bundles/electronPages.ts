import devicePages from 'protolib/bundles/devices/adminPages'
import filesPages from 'protolib/bundles/files/adminPages'
import usersPages from 'protolib/bundles/users/adminPages'
import groupsPages from 'protolib/bundles/groups/adminPages'
import keysPages from 'protolib/bundles/keys/adminPages'
import eventsPages from 'protolib/bundles/events/adminPages'
import objectsPages from 'protolib/bundles/objects/adminPages'
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
    ...keysPages,
    ...eventsPages,
    ...databasesPages,
    ...objectsPages,
    ...pagesPages,
    ...apisPages,
    ...messagesPages,
    ...resourcesPages
}