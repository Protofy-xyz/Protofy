import { NoteModel } from "./notesModels";
import {CreateApi} from 'protolib/api'

export const NotesAPI = CreateApi('notes', NoteModel, __dirname)
