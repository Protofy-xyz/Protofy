import notesPages from './notes/nextPages'
import databasePages from './database/adminPages'
import devicePages from './devices/adminPages'
export default {
    ...notesPages,
    ...databasePages,
    ...devicePages
}