import {NotesAPI} from './notes/notesAPI'
import CustomAPI from './custom/apis'

export default (app) => {
    NotesAPI(app)
    CustomAPI(app)
}