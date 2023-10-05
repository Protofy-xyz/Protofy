import { NoteModel } from "./notesModels";
import {BaseApi} from 'protolib/base'
import fs from 'fs'
import path from 'path'

const initialData = JSON.parse(fs.readFileSync(path.join(__dirname, 'initialData.json')).toString())
export const NotesAPI = (app) => BaseApi(app, 'notes', NoteModel, initialData)
