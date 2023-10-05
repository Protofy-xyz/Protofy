import { NoteSchema, NoteType } from "./notesSchemas"
import { createSession, SessionDataType } from 'protolib/api'

export class NoteModel {
    data: NoteType
    session: SessionDataType
    constructor(data: NoteType, session?: SessionDataType) {
        this.data = data
        this.session = session ?? createSession()
    }

    getId() {
        return this.data.id
    }

    setId(id: string) {
        return new NoteModel({
            ...this.data,
            id: id
        }, this.session)
    }

    //generates a new notemodal with a generated id
    generateId() {
        return new NoteModel({
            ...this.data,
            id: ""+Math.random()
        }, this.session)
    }

    isVisible() {
        return this.isDeleted()
    }

    //true if deleted, false otherwise
    isDeleted() {
        return this.data._deleted ? true : false
    }

    //get data to appear on list
    list() {
        return this.read()
    }

    //called when the note is created in the server
    create() {
        return this.generateId().validate()
    }

    //get data from storage to client
    read() {
        return {
            ...this.data
        }
    }

    //asks for an update, can throw or change things
    update(updatedNote: NoteModel) {
        return updatedNote.setId(this.getId()) //accept the update, but keep our id
    }

    //asks for deletion, can throw to avoid deletion
    delete() {
        return new NoteModel({
            ...this.data,
            _deleted: true
        }, this.session)
    }

    //validate model
    validate() {
        NoteSchema.parse(this.data) //validate
        return this
    }

    //called when being dumped to storage
    serialize() {
        return JSON.stringify(this.data)
    }

    //called when being recovered from storage
    static unserialize(data:string, session?: SessionDataType) {
        return new NoteModel(JSON.parse(data), session)
    }

    //get raw data
    getData() {
        return this.data
    }

    static load(data: NoteType, session?: SessionDataType) {
        return new NoteModel(data, session)
    }
}

export class NoteCollection {
    notes: NoteModel[]

    constructor(notes: NoteModel[]) {
        this.notes = notes
    }

    static load (notesData: NoteType[]) {
        return new NoteCollection(notesData.map(noteData => new NoteModel(noteData)))
    }

    getData() {
        return this.notes.map(note => note.getData())
    }

    filter(fn: (value: NoteModel, index: number, array: NoteModel[]) => value is NoteModel) {
        return new NoteCollection(this.notes.filter(fn))
    }
}