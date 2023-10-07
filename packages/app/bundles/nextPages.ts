import notesPages from './notes/nextPages'
import databasePages from './database/adminPages'
import devicePages from './devices/adminPages'
import filesPages from 'protolib/adminpanel/bundles/files/adminPages'
import usersPages from 'protolib/adminpanel/bundles/users/adminPages'

export default {
    ...notesPages,
    ...databasePages,
    ...devicePages,
    ...filesPages,
    ...usersPages
}