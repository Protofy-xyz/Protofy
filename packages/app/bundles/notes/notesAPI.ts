import {initialData} from "./notesInitialData";
import { NoteModel } from "./notesModels";
import {BaseApi} from 'protolib/base'

export const NotesAPI = (app) => BaseApi(app, 'notes', NoteModel, initialData)
