import devicePages from './devices/adminPages'
import filesPages from './files/adminPages'
import usersPages from './users/adminPages'
import groupsPages from './groups/adminPages'
import keysPages from './keys/adminPages'
import eventsPages from './events/adminPages'
import objectsPages from './objects/adminPages'
import messagesPages from './messages/adminPages'
import pagesPages from './pages/adminPages'
import apisPages from './apis/adminPages'
import databasesPages from './databases/adminPages'
import resourcesPages from './resources/adminPages'

export const ElectronPagesBundles = {
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