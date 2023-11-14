import {NotesAPI} from './notes/notesAPI'
import CustomAPI from './custom/apis'

export default (app, context) => {
    NotesAPI(app, context)
    CustomAPI(app, context)
}